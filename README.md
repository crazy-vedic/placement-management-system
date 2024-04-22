Request Xampp connectivity with the following tables:
CREATE TABLE students (
  Student ID int(11) NOT NULL,
  Name varchar(50) NOT NULL,
  Year int(11) NOT NULL,
  CGPA double NOT NULL,
  Email varchar(50) NOT NULL,
  Placement ID int(11) NOT NULL,
  PRIMARY KEY (Student ID),
  UNIQUE KEY Placement ID (Placement ID),
  UNIQUE KEY Student ID (Student ID),
  KEY Student ID_2 (Student ID),
  KEY Placement ID_2 (Placement ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci

  CREATE TABLE placements (
  Placement ID int(11) NOT NULL,
  Student ID int(11) NOT NULL,
  Company varchar(50) NOT NULL,
  Date varchar(50) NOT NULL,
  Details varchar(500) NOT NULL,
  PRIMARY KEY (Placement ID),
  UNIQUE KEY Placement ID (Placement ID),
  KEY Student ID (Student ID),
  CONSTRAINT placements_ibfk_1 FOREIGN KEY (Student ID) REFERENCES students (Student ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci

CREATE TABLE skills (
  Student ID int(11) NOT NULL,
  Skills varchar(50) NOT NULL,
  PRIMARY KEY (Student ID,Skills),
  KEY Student ID (Student ID),
  KEY Student ID_2 (Student ID),
  CONSTRAINT skills_ibfk_1 FOREIGN KEY (Student ID) REFERENCES students (Student ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
