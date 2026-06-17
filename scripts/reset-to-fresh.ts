import { pool, query } from "../lib/db";
import { createUser } from "../lib/auth/users";
import { validatePassword } from "../lib/auth/validate";

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const i = a.indexOf("=");
    return i > 0 ? [a.slice(2, i), a.slice(i + 1)] : [a.replace(/^--/, ""), ""];
  }),
);

const login = (args.login || "").trim();
const password = args.password || "";
const dob = (args.dob || "").trim();

if (!login || !password || !dob) {
  console.error("Usage: npx tsx scripts/reset-to-fresh.ts --login=admin --password=XXXX --dob=2002-02-08");
  process.exit(1);
}

const passErr = validatePassword(password);
if (passErr) {
  console.error(`Password rejected: ${passErr.message}`);
  process.exit(1);
}

async function main() {
  console.log("Wiping data...");

  await query(`TRUNCATE TABLE notifications RESTART IDENTITY CASCADE`);
  console.log("  notifications cleared");

  await query(`TRUNCATE TABLE lessons RESTART IDENTITY CASCADE`);
  console.log("  lessons cleared");

  await query(`TRUNCATE TABLE sessions RESTART IDENTITY CASCADE`);
  console.log("  sessions cleared");

  await query(`TRUNCATE TABLE reviews RESTART IDENTITY CASCADE`).catch(() => {});
  console.log("  reviews cleared");

  await query(`TRUNCATE TABLE blocked_ips RESTART IDENTITY CASCADE`).catch(() => {});
  console.log("  blocked_ips cleared");

  await query(`TRUNCATE TABLE blocked_chat_ids RESTART IDENTITY CASCADE`).catch(() => {});
  console.log("  blocked_chat_ids cleared");

  await query(`TRUNCATE TABLE tg_mod_messages RESTART IDENTITY CASCADE`).catch(() => {});
  console.log("  tg_mod_messages cleared");

  await query(`TRUNCATE TABLE tg_moderators RESTART IDENTITY CASCADE`).catch(() => {});
  console.log("  tg_moderators cleared");

  await query(`DELETE FROM users`);
  console.log("  users cleared");

  console.log(`Creating admin "${login}"...`);
  const user = await createUser(login, password, dob);
  await query(`UPDATE users SET role = 'admin' WHERE id = $1::bigint`, [user.id]);
  console.log(`  admin id=${user.id}, role=admin, login=${login}`);

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    pool.end().catch(() => {});
  });
