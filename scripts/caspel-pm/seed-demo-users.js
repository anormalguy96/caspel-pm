const { execSync } = require('child_process');
const crypto = require('crypto');

function hashWithSalt(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1000, 32, 'sha256');
}

const USERS = [
  {
    uuid: '11111111-2222-4333-8444-555555555551',
    firstName: 'QA',
    lastName: 'Owner',
    email: 'owner@caspel.local',
    password: 'Password123!',
    role: 'OWNER'
  },
  {
    uuid: '11111111-2222-4333-8444-555555555552',
    firstName: 'QA',
    lastName: 'Member',
    email: 'member@caspel.local',
    password: 'Password123!',
    role: 'MAINTAINER'
  },
  {
    uuid: '11111111-2222-4333-8444-555555555553',
    firstName: 'QA',
    lastName: 'Guest',
    email: 'guest@caspel.local',
    password: 'Password123!',
    role: 'GUEST'
  },
  {
    uuid: '11111111-2222-4333-8444-555555555554',
    firstName: 'QA',
    lastName: 'Outsider',
    email: 'outsider@caspel.local',
    password: 'Password123!',
    role: null // Uninvited external user
  }
];

const GUEST_UUID = '83bbed9a-0867-4851-be32-31d49d1d42ce';
const WORKSPACE_UUIDS = ['3b8b8eae-3cee-4551-a858-f34aea83edfc', '49081784-6001-4076-b4b1-0b5c0023f4d4'];

function escapeSql(str) {
  return str.replace(/'/g, "''");
}

function hexString(buf) {
  return '\\x' + buf.toString('hex');
}

function runSql(sql) {
  return execSync('docker exec -i dev-cockroach-1 ./cockroach sql --insecure -d defaultdb', {
    input: sql
  }).toString();
}

async function main() {
  console.log('Seeding Caspel PM Demo Accounts and Guest Access...');

  let sqlStatements = [];

  // 1. Ensure Anonymous Guest exists and has workspace access
  sqlStatements.push(`
    INSERT INTO global_account.person (uuid, first_name, last_name)
    VALUES ('${GUEST_UUID}', 'Anonymous', 'Guest')
    ON CONFLICT (uuid) DO NOTHING;

    INSERT INTO global_account.account (uuid, automatic, failed_login_attempts)
    VALUES ('${GUEST_UUID}', true, 0)
    ON CONFLICT (uuid) DO NOTHING;

    INSERT INTO global_account.social_id (type, value, person_uuid, created_on, verified_on, is_deleted)
    VALUES ('huly', '${GUEST_UUID}', '${GUEST_UUID}', 1789568282900, 1789568283000, false)
    ON CONFLICT (type, value) DO NOTHING;

    UPDATE global_account.workspace
    SET allow_read_only_guest = true, name = 'Caspel PM QA Workspace'
    WHERE uuid = '3b8b8eae-3cee-4551-a858-f34aea83edfc';

    UPDATE global_account.workspace
    SET allow_read_only_guest = true
    WHERE uuid = '49081784-6001-4076-b4b1-0b5c0023f4d4';

    INSERT INTO global_account.workspace_members (workspace_uuid, account_uuid, role)
    VALUES ('3b8b8eae-3cee-4551-a858-f34aea83edfc', '${GUEST_UUID}', 'READONLYGUEST')
    ON CONFLICT (workspace_uuid, account_uuid) DO NOTHING;

    INSERT INTO global_account.workspace_members (workspace_uuid, account_uuid, role)
    VALUES ('49081784-6001-4076-b4b1-0b5c0023f4d4', '${GUEST_UUID}', 'READONLYGUEST')
    ON CONFLICT (workspace_uuid, account_uuid) DO NOTHING;
  `);

  // 2. Provision the 4 demo users
  for (const user of USERS) {
    const salt = crypto.randomBytes(32);
    const hash = hashWithSalt(user.password, salt);

    sqlStatements.push(`
      INSERT INTO global_account.person (uuid, first_name, last_name)
      VALUES ('${user.uuid}', '${escapeSql(user.firstName)}', '${escapeSql(user.lastName)}')
      ON CONFLICT (uuid) DO UPDATE SET first_name = '${escapeSql(user.firstName)}', last_name = '${escapeSql(user.lastName)}';

      INSERT INTO global_account.account (uuid, automatic, failed_login_attempts)
      VALUES ('${user.uuid}', false, 0)
      ON CONFLICT (uuid) DO UPDATE SET failed_login_attempts = 0;

      INSERT INTO global_account.social_id (type, value, person_uuid, created_on, verified_on, is_deleted)
      VALUES ('email', '${escapeSql(user.email)}', '${user.uuid}', 1789568282900, 1789568283000, false)
      ON CONFLICT (type, value) DO UPDATE SET person_uuid = '${user.uuid}', is_deleted = false;

      INSERT INTO global_account.social_id (type, value, person_uuid, created_on, verified_on, is_deleted)
      VALUES ('huly', '${user.uuid}', '${user.uuid}', 1789568282900, 1789568283000, false)
      ON CONFLICT (type, value) DO UPDATE SET person_uuid = '${user.uuid}', is_deleted = false;

      INSERT INTO global_account.account_passwords (account_uuid, hash, salt)
      VALUES ('${user.uuid}', '${hexString(hash)}'::BYTES, '${hexString(salt)}'::BYTES)
      ON CONFLICT (account_uuid) DO UPDATE SET hash = '${hexString(hash)}'::BYTES, salt = '${hexString(salt)}'::BYTES;
    `);

    if (user.role != null) {
      for (const wsId of WORKSPACE_UUIDS) {
        sqlStatements.push(`
          INSERT INTO global_account.workspace_members (workspace_uuid, account_uuid, role)
          VALUES ('${wsId}', '${user.uuid}', '${user.role}')
          ON CONFLICT (workspace_uuid, account_uuid) DO UPDATE SET role = '${user.role}';
        `);
      }
    }
  }

  const fullSql = sqlStatements.join('\n');
  console.log('Executing database migrations/inserts in CockroachDB...');
  const out = await runSql(fullSql);
  console.log('Database updated successfully.');

  // 3. Verify logins via RPC
  console.log('\n--- Verifying Logins via Account RPC (http://huly.local:3000) ---');

  // Verify Guest
  try {
    const guestRes = await (await fetch('http://huly.local:3000', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method: 'loginAsGuest', params: {} })
    })).json();

    if (guestRes.result && guestRes.result.token) {
      console.log('✔ Continue as Guest: SUCCESS (token returned)');
    } else {
      console.error('✖ Continue as Guest: FAILED', guestRes);
    }
  } catch (e) {
    console.error('✖ Continue as Guest error:', e.message);
  }

  // Verify 4 Demo Users
  for (const user of USERS) {
    try {
      const loginRes = await (await fetch('http://huly.local:3000', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'login',
          params: { email: user.email, password: user.password }
        })
      })).json();

      if (loginRes.result && loginRes.result.token) {
        console.log(`✔ ${user.email} (${user.firstName} ${user.lastName}, Role: ${user.role ?? 'None'}): SUCCESS (token returned)`);
      } else {
        console.error(`✖ ${user.email}: FAILED`, loginRes);
      }
    } catch (e) {
      console.error(`✖ ${user.email} error:`, e.message);
    }
  }

  console.log('\nAll 4 demo users seeded and verified successfully!');
}

main().catch(console.error);
