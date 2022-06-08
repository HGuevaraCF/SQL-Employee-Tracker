INSERT INTO departments (id, name)
VALUES  (001, "Sales"),
        (002, "Engineering"),
        (003, "Finance"),
        (004, "Legal");

INSERT INTO roles (id, title, salary, department_id)
VALUES  (001, "Sales Lead", 100000, 001),
        (002, "Sales Person", 80000, 001),
        (003, "Lead Engineer", 150000, 002),
        (004, "Software Enginner", 120000, 002),
        (005, "Account Manager", 160000, 003),
        (006, "Accountant", 125000, 003),
        (007, "Lawyer", 190000, 004);

INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
VALUES  (001, "John", "Doe", 001),
        (002, "Mike", "Chan", 002, 001),
        (003, "Ashley", "Rodriguez", 004),
        (004, "Kevin", "Tupik", 004, 003),
        (005, "Kunal", "Singh", 005, 001);