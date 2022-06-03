INSERT INTO departments (id, name)
VALUES  (001, "Sales"),
        (002, "Engineering"),
        (003, "Finance"),
        (004, "Legal");

INSERT INTO roles (id, title, salary, department_id)
VALUES  (001, 001 "Sales Lead"),
        (002, 001, "Sales Person"),
        (003, 002, "Lead Engineer"),
        (004, 002, "Software Enginner"),
        (005, 003, "Account Manager"),
        (006, 003, "Accountant"),
        (007, 004, "Lawyer")

INSERT INTO employees (id first_name, last_name, role_id, manager_id)
VALUES  (001, "John", "Doe", 001, 001),
        (002, "Mike", "Chan", 002, 001),
        (003, "Ashley", "Rodriguez", 004, 001),
        (004, "Kevin", "Tupik", 004, 001),
        (005, "Kunal", "Singh", 005, 001),