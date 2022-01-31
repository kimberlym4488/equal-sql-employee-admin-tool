INSERT INTO
  department (id, departmentName)
VALUES
  (1, "Sales"),
  (2, "Accounting"),
  (3, "HR"),
  (4, "Operations");
INSERT INTO
  roles (id, title, salary, department_id)
VALUES

  (500, "Sales Manager", "100000", 1),
  (501, "Accounts PayandReceive", "60000", 2),
  (502, "Payroll", "40000", 2),
  (503, "Receptionist", "30000", 4),
  (504, "Employee Liaison", "40000", 3),
  (505, "Sales Associate", "40000", 1),
  (506, "Operations Manager", "100000", 4),
  (507, "Operations Assistant", "50000", 4),
  (508, "Sales Executive", "70000", 1);


  INSERT INTO
    employee (id, first_name, last_name, role_id, manager_id)
VALUES
    (100, "Gregory", "Poopsicle", 500, null),
    (101, "Rellen", "Runt", 508, 100),
    (102, "Silly", "Sally", 508, 100),
    (103, "Robert", "Time", 505, 100),
    (104, "Justin", "Time", 505, 100),
    (105, "Sweet", "BabyRaes", 506, null),
    (106, "Hello", "World", 501, 105),
    (107, "My", "sunshine", 502, 105),
    (108, "Timeto", "Party", 503, 105),
    (109, "Cranges", "McBasketball", 504, 105),
    (110, "Mikla", "Brc", 507, 105);
