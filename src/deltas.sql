SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;

CREATE DATABASE `delta`;

CREATE TABLE `delta`.`deltas` (
                          `id` int(11) NOT NULL,
                          `delta` text NOT NULL,
                          `uuid` text NOT NULL,
                          `encrypted` text NOT NULL,
                          `autodelete` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `delta`.`deltas`
    ADD PRIMARY KEY (`id`);

ALTER TABLE `delta`.`deltas`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=80;
COMMIT;
