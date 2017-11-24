DROP TABLE IF EXISTS `school`;
DROP TABLE IF EXISTS `concentrations`;
DROP TABLE IF EXISTS `hpcharacter`;
DROP TABLE IF EXISTS `house`;
DROP TABLE IF EXISTS `pet`;
DROP TABLE IF EXISTS `hpcharacter_relations`;
DROP TABLE IF EXISTS `hpcharacter_concentrations`;
DROP TABLE IF EXISTS `schools_houses`;

CREATE TABLE `school` (
  `id` INT(16) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `yearfounded` INT(16) DEFAULT NULL,
  `location` VARCHAR(255) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  PRIMARY KEY (id)
)ENGINE=InnoDB AUTO_INCREMENT=1000;

CREATE TABLE `concentrations` (
  `id` INT(16) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  PRIMARY KEY (id)
)ENGINE=InnoDB AUTO_INCREMENT=1000;

CREATE TABLE `hpcharacter` (
  `id` INT(16) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `hometown` VARCHAR(255),
  `birth` DATE DEFAULT NULL,
  `death` DATE DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `house_id` INT(16) DEFAULT NULL,
  PRIMARY KEY (id),
  CONSTRAINT FOREIGN KEY (house_id) REFERENCES house(id) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE=InnoDB AUTO_INCREMENT=1000;

CREATE TABLE `house` (
  `id` INT(16) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `animal` VARCHAR(255) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `founder_id` INT(16) DEFAULT NULL,
  `school_id` INT(16) NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT FOREIGN KEY (founder_id) REFERENCES hpcharacter(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT FOREIGN KEY (school_id) REFERENCES school(id) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE=InnoDB AUTO_INCREMENT=1000;

CREATE TABLE `pet` (
  `id` INT(16) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `type` VARCHAR(255) DEFAULT NULL,
  `age` INT(16) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `owner_id` INT(16) NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT FOREIGN KEY (owner_id) REFERENCES hpcharacter(id) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE=InnoDB AUTO_INCREMENT=1000;

CREATE TABLE `hpcharacter_relations` (
  `relation` VARCHAR(255) NOT NULL,
  `char1_id` INT(16) NOT NULL,
  `char2_id` INT(16) NOT NULL,
  CONSTRAINT FOREIGN KEY (char1_id) REFERENCES hpcharacter(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT FOREIGN KEY (char2_id) REFERENCES hpcharacter(id) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE=InnoDB;

CREATE TABLE `hpcharacter_concentrations` (
  `hpcharacter_id` INT(16) NOT NULL,
  `concentration_id` INT(16) NOT NULL,
  CONSTRAINT FOREIGN KEY (hpcharacter_id) REFERENCES hpcharacter(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT FOREIGN KEY (concentration_id) REFERENCES concentrations(id) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE=InnoDB;
