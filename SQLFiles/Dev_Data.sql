-- TEST DATA
INSERT INTO `users` (`email`, `password`, `civility`, `firstname`, `lastname`, `type`)
VALUES  ('test@test.test', '$2a$05$WkcMIl.lXO8Qnz./o2l4HeLssZ.OYcHDZMVzXqXBtLhQshofMRfmy', 'Mr', 'Alex', 'Terrieur', 'User');

INSERT INTO  `users` (`email`, `password`, `civility`,`firstname`, `lastname`, `type`)
VALUES  ('admin@admin.admin', '$2a$05$WkcMIl.lXO8Qnz./o2l4HeLssZ.OYcHDZMVzXqXBtLhQshofMRfmy', 'Mr','Kevin', 'Nguyen', 'Admin');