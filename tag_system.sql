-- MySQL dump 10.16  Distrib 10.1.10-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: tag_system
-- ------------------------------------------------------
-- Server version	10.1.10-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tag_api`
--

DROP TABLE IF EXISTS `tag_api`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tag_api` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `status` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `comment` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag_api`
--

LOCK TABLES `tag_api` WRITE;
/*!40000 ALTER TABLE `tag_api` DISABLE KEYS */;
INSERT INTO `tag_api` VALUES (7,1,0,'funfunquiz使用');
/*!40000 ALTER TABLE `tag_api` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tag_api_level`
--

DROP TABLE IF EXISTS `tag_api_level`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tag_api_level` (
  `api_id` int(11) NOT NULL,
  `level_id` int(11) NOT NULL,
  `sort_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag_api_level`
--

LOCK TABLES `tag_api_level` WRITE;
/*!40000 ALTER TABLE `tag_api_level` DISABLE KEYS */;
INSERT INTO `tag_api_level` VALUES (7,11,1),(7,13,0);
/*!40000 ALTER TABLE `tag_api_level` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tag_level`
--

DROP TABLE IF EXISTS `tag_level`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tag_level` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag_level`
--

LOCK TABLES `tag_level` WRITE;
/*!40000 ALTER TABLE `tag_level` DISABLE KEYS */;
INSERT INTO `tag_level` VALUES (11,0),(13,0);
/*!40000 ALTER TABLE `tag_level` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tag_name`
--

DROP TABLE IF EXISTS `tag_name`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tag_name` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_time` datetime NOT NULL,
  `created_time_int` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag_name`
--

LOCK TABLES `tag_name` WRITE;
/*!40000 ALTER TABLE `tag_name` DISABLE KEYS */;
INSERT INTO `tag_name` VALUES (1,'a','2016-09-14 14:23:19',1473834199),(2,'aa','2016-09-14 14:23:25',1473834205),(3,'b','2016-09-14 14:25:39',1473834339),(4,'cc','2016-09-14 14:25:43',1473834343),(5,'rr','2016-09-14 14:28:47',1473834527),(6,'rrr','2016-09-14 14:32:35',1473834755),(7,'qqq','2016-09-14 14:34:00',1473834840),(8,'eee','2016-09-14 14:34:04',1473834844),(9,'aaa','2016-09-14 14:38:54',1473835134),(10,'bbb','2016-09-14 14:48:15',1473835695),(11,'aaaaa','2016-09-14 14:51:15',1473835875),(12,'ddd','2016-09-14 14:51:18',1473835878),(13,'dddd','2016-09-14 14:51:50',1473835910),(14,'c','2016-09-14 14:57:14',1473836234),(15,'bb','2016-09-14 14:57:24',1473836244),(16,'ccc','2016-09-14 14:57:33',1473836253);
/*!40000 ALTER TABLE `tag_name` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tag_relation`
--

DROP TABLE IF EXISTS `tag_relation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tag_relation` (
  `id` int(11) NOT NULL,
  `child_id` int(11) NOT NULL,
  `level_id` int(11) NOT NULL,
  PRIMARY KEY (`id`,`child_id`,`level_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag_relation`
--

LOCK TABLES `tag_relation` WRITE;
/*!40000 ALTER TABLE `tag_relation` DISABLE KEYS */;
INSERT INTO `tag_relation` VALUES (1,2,11),(1,2,13),(1,9,11),(3,10,11),(3,15,11),(3,15,13),(14,4,11),(14,16,11);
/*!40000 ALTER TABLE `tag_relation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tag_relation_count`
--

DROP TABLE IF EXISTS `tag_relation_count`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tag_relation_count` (
  `id` int(11) NOT NULL,
  `level_id` int(11) NOT NULL,
  `count` int(11) NOT NULL,
  PRIMARY KEY (`id`,`level_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag_relation_count`
--

LOCK TABLES `tag_relation_count` WRITE;
/*!40000 ALTER TABLE `tag_relation_count` DISABLE KEYS */;
INSERT INTO `tag_relation_count` VALUES (1,11,2),(3,11,2),(14,11,2),(1,13,1),(3,13,1),(15,11,0);
/*!40000 ALTER TABLE `tag_relation_count` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-09-19  8:30:45
