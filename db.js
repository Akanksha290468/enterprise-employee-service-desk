const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const dir = path.join(__dirname, 'data');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
const db = new Database(path.join(dir, 'service_desk.db'));
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');
db.exec(`
CREATE TABLE IF NOT EXISTS departments(id INTEGER PRIMARY KEY, name TEXT UNIQUE NOT NULL, manager_id INTEGER);
CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('employee','executive','manager','admin')), department_id INTEGER, active INTEGER DEFAULT 1, created_at TEXT DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(department_id) REFERENCES departments(id));
CREATE TABLE IF NOT EXISTS categories(id INTEGER PRIMARY KEY, name TEXT UNIQUE NOT NULL, department_id INTEGER NOT NULL, FOREIGN KEY(department_id) REFERENCES departments(id));
CREATE TABLE IF NOT EXISTS service_requests(id INTEGER PRIMARY KEY AUTOINCREMENT, request_code TEXT UNIQUE NOT NULL, employee_id INTEGER NOT NULL, title TEXT NOT NULL, category_id INTEGER NOT NULL, department_id INTEGER NOT NULL, description TEXT NOT NULL, priority TEXT NOT NULL CHECK(priority IN ('Low','Medium','High','Critical')), status TEXT NOT NULL DEFAULT 'Submitted', required_date TEXT, attachment TEXT, assigned_to INTEGER, created_at TEXT DEFAULT CURRENT_TIMESTAMP, updated_at TEXT DEFAULT CURRENT_TIMESTAMP, resolved_at TEXT, reopened INTEGER DEFAULT 0, FOREIGN KEY(employee_id) REFERENCES users(id), FOREIGN KEY(category_id) REFERENCES categories(id), FOREIGN KEY(department_id) REFERENCES departments(id), FOREIGN KEY(assigned_to) REFERENCES users(id));
CREATE TABLE IF NOT EXISTS assignments(id INTEGER PRIMARY KEY, request_id INTEGER NOT NULL, assigned_by INTEGER NOT NULL, assigned_to INTEGER NOT NULL, note TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(request_id) REFERENCES service_requests(id), FOREIGN KEY(assigned_by) REFERENCES users(id), FOREIGN KEY(assigned_to) REFERENCES users(id));
CREATE TABLE IF NOT EXISTS comments(id INTEGER PRIMARY KEY, request_id INTEGER NOT NULL, user_id INTEGER NOT NULL, body TEXT NOT NULL, internal INTEGER DEFAULT 0, created_at TEXT DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(request_id) REFERENCES service_requests(id), FOREIGN KEY(user_id) REFERENCES users(id));
CREATE TABLE IF NOT EXISTS status_history(id INTEGER PRIMARY KEY, request_id INTEGER NOT NULL, user_id INTEGER NOT NULL, old_status TEXT, new_status TEXT NOT NULL, note TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(request_id) REFERENCES service_requests(id), FOREIGN KEY(user_id) REFERENCES users(id));
CREATE TABLE IF NOT EXISTS notifications(id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, request_id INTEGER, message TEXT NOT NULL, is_read INTEGER DEFAULT 0, created_at TEXT DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(user_id) REFERENCES users(id), FOREIGN KEY(request_id) REFERENCES service_requests(id));
CREATE TABLE IF NOT EXISTS audit_logs(id INTEGER PRIMARY KEY, user_id INTEGER, action TEXT NOT NULL, request_id INTEGER, details TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(user_id) REFERENCES users(id), FOREIGN KEY(request_id) REFERENCES service_requests(id));
`);
const departments = ['IT','HR','Finance','Administration','Facilities','Security','Payroll'];
for (const name of departments) db.prepare('INSERT OR IGNORE INTO departments(name) VALUES (?)').run(name);
const dept = Object.fromEntries(db.prepare('SELECT id,name FROM departments').all().map(x => [x.name,x.id]));
const categories = [['IT Support','IT'],['HR','HR'],['Finance','Finance'],['Administration','Administration'],['Facilities','Facilities'],['Security','Security'],['Payroll','Payroll']];
for (const [name,d] of categories) db.prepare('INSERT OR IGNORE INTO categories(name,department_id) VALUES (?,?)').run(name,dept[d]);
const users = [
 ['System Admin','admin@company.com','Admin@123','admin','IT'],
 ['Priya Manager','manager@company.com','Manager@123','manager','IT'],
 ['Rahul Sharma','executive@company.com','Exec@123','executive','IT'],
 ['Akanksha Employee','employee@company.com','User@123','employee','HR'],
 ['Finance Executive','finance@company.com','Exec@123','executive','Finance']
];
for (const [name,email,password,role,d] of users) {
 const exists = db.prepare('SELECT id FROM users WHERE email=?').get(email);
 if (!exists) db.prepare('INSERT INTO users(name,email,password_hash,role,department_id) VALUES (?,?,?,?,?)').run(name,email,bcrypt.hashSync(password,10),role,dept[d]);
}
const count = db.prepare('SELECT COUNT(*) AS n FROM service_requests').get().n;
if (!count) {
 const employee = db.prepare("SELECT id FROM users WHERE email='employee@company.com'").get().id;
 const it = db.prepare("SELECT id FROM categories WHERE name='IT Support'").get().id;
 const fin = db.prepare("SELECT id FROM categories WHERE name='Finance'").get().id;
 const admin = db.prepare("SELECT id FROM categories WHERE name='Administration'").get().id;
 const insert = db.prepare('INSERT INTO service_requests(request_code,employee_id,title,category_id,department_id,description,priority,status,assigned_to) VALUES (?,?,?,?,?,?,?,?,?)');
 const add = db.transaction(() => {
  const rows = [ ['REQ-1001','VPN access not working',it,dept.IT,'Unable to connect to the company VPN from home.','High','In Progress',db.prepare("SELECT id FROM users WHERE email='executive@company.com'").get().id], ['REQ-1002','Salary slip query',fin,dept.Finance,'Please help me download my latest salary slip.','Medium','Submitted',null], ['REQ-1003','Replacement ID card',admin,dept.Administration,'My employee ID card is damaged.','Low','Resolved',null] ];
  for (const r of rows) insert.run(r[0],employee,r[1],r[2],r[3],r[4],r[5],r[6],r[7]);
 }); add();
}
module.exports = db;
