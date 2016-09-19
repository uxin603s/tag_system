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
INSERT INTO `tag_api_level` VALUES (7,8,0);
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
  `sync_relation` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag_level`
--

LOCK TABLES `tag_level` WRITE;
/*!40000 ALTER TABLE `tag_level` DISABLE KEYS */;
INSERT INTO `tag_level` VALUES (8,0);
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
) ENGINE=MyISAM AUTO_INCREMENT=28 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag_name`
--

LOCK TABLES `tag_name` WRITE;
/*!40000 ALTER TABLE `tag_name` DISABLE KEYS */;
INSERT INTO `tag_name` VALUES (1,'aa','2016-09-19 14:07:40',1474265260),(2,'a','2016-09-19 14:08:11',1474265291),(3,'aaa','2016-09-19 14:08:14',1474265294),(4,'eee','2016-09-19 14:11:59',1474265519),(5,'eeee','2016-09-19 14:12:54',1474265574),(6,'ooo','2016-09-19 14:13:01',1474265581),(7,'q','2016-09-19 14:17:56',1474265876),(8,'qw','2016-09-19 14:18:23',1474265903),(9,'qq','2016-09-19 14:18:37',1474265917),(10,'sss','2016-09-19 14:19:28',1474265968),(11,'qwe','2016-09-19 14:19:41',1474265981),(12,'dfsdfsdffdfsdfsdfdsfsdfds','2016-09-19 14:22:21',1474266141),(13,'第一層','2016-09-19 14:23:03',1474266183),(14,'第二層','2016-09-19 14:23:08',1474266188),(15,'asdasd','2016-09-19 14:24:26',1474266266),(16,'ss','2016-09-19 14:26:15',1474266375),(17,'bb','2016-09-19 14:28:03',1474266483),(18,'cc','2016-09-19 14:28:04',1474266484),(19,'1','2016-09-19 14:33:32',1474266812),(20,'2','2016-09-19 14:33:34',1474266814),(21,'3','2016-09-19 14:33:35',1474266815),(22,'4','2016-09-19 14:33:36',1474266816),(23,'qqq','2016-09-19 16:34:34',1474274074),(24,'11','2016-09-19 16:58:04',1474275484),(25,'qqqq','2016-09-19 17:04:27',1474275867),(26,'tttt','2016-09-19 17:06:23',1474275983),(27,'aaaa','2016-09-19 17:08:08',1474276088);
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
INSERT INTO `tag_relation_count` VALUES (13,8,0),(23,8,0),(9,8,0);
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

-- Dump completed on 2016-09-19 17:09:35
