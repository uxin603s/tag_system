-- MySQL dump 10.15  Distrib 10.0.27-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: tag_system
-- ------------------------------------------------------
-- Server version	10.0.27-MariaDB

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
-- Table structure for table `alias_list`
--

DROP TABLE IF EXISTS `alias_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `alias_list` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `source_id` int(11) NOT NULL,
  `wid` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`,`wid`),
  KEY `source_id` (`source_id`,`wid`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alias_list`
--

LOCK TABLES `alias_list` WRITE;
/*!40000 ALTER TABLE `alias_list` DISABLE KEYS */;
INSERT INTO `alias_list` VALUES (1,1,3),(2,2,3);
/*!40000 ALTER TABLE `alias_list` ENABLE KEYS */;
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
) ENGINE=MyISAM AUTO_INCREMENT=24 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag_name`
--

LOCK TABLES `tag_name` WRITE;
/*!40000 ALTER TABLE `tag_name` DISABLE KEYS */;
INSERT INTO `tag_name` VALUES (1,'aa','2016-11-07 09:47:44',1478483264),(2,'vv','2016-11-07 09:47:46',1478483266),(3,'bb','2016-11-07 09:52:26',1478483546),(4,'cc','2016-11-07 09:52:27',1478483547),(5,'dd','2016-11-07 09:53:05',1478483585),(6,'rr','2016-11-07 09:54:46',1478483686),(7,'ee','2016-11-07 09:54:58',1478483698),(8,'qq','2016-11-07 09:55:02',1478483702),(9,'ggwp','2016-11-07 09:56:07',1478483767),(10,'asdasddfert','2016-11-07 09:59:52',1478483992),(11,'eee','2016-11-07 10:05:48',1478484348),(12,'sadffs','2016-11-07 10:05:51',1478484351),(13,'aad','2016-11-07 11:45:48',1478490348),(14,'a','2016-11-07 11:46:02',1478490362),(15,'b','2016-11-07 11:51:55',1478490715),(16,'e','2016-11-07 11:53:58',1478490838),(17,'c','2016-11-07 20:41:28',1478522488),(18,'Array','2016-11-07 23:02:09',1478530929),(19,'d','2016-11-07 23:25:11',1478532311),(20,'f','2016-11-07 23:27:45',1478532465),(21,'g','2016-11-07 23:28:06',1478532486),(22,'h','2016-11-07 23:28:12',1478532492),(23,'q','2016-11-07 23:30:40',1478532640);
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
  `sort_id` int(11) NOT NULL,
  PRIMARY KEY (`id`,`child_id`,`level_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag_relation`
--

LOCK TABLES `tag_relation` WRITE;
/*!40000 ALTER TABLE `tag_relation` DISABLE KEYS */;
INSERT INTO `tag_relation` VALUES (1,14,13,0),(1,15,13,1),(17,1,14,1),(17,2,14,0),(19,1,14,0);
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
  `sort_id` int(11) NOT NULL,
  PRIMARY KEY (`id`,`level_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag_relation_count`
--

LOCK TABLES `tag_relation_count` WRITE;
/*!40000 ALTER TABLE `tag_relation_count` DISABLE KEYS */;
INSERT INTO `tag_relation_count` VALUES (15,14,0,0),(14,14,0,0),(1,13,2,0),(3,13,0,1),(17,14,2,0),(5,13,0,3),(4,13,0,2),(19,14,1,0);
/*!40000 ALTER TABLE `tag_relation_count` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tag_relation_level`
--

DROP TABLE IF EXISTS `tag_relation_level`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tag_relation_level` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'level_id',
  `sort_id` int(11) NOT NULL COMMENT '第一層為0',
  `tid` int(11) NOT NULL COMMENT 'tag_type表關聯',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag_relation_level`
--

LOCK TABLES `tag_relation_level` WRITE;
/*!40000 ALTER TABLE `tag_relation_level` DISABLE KEYS */;
INSERT INTO `tag_relation_level` VALUES (13,0,1),(14,1,1);
/*!40000 ALTER TABLE `tag_relation_level` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tag_type`
--

DROP TABLE IF EXISTS `tag_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tag_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `sort_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag_type`
--

LOCK TABLES `tag_type` WRITE;
/*!40000 ALTER TABLE `tag_type` DISABLE KEYS */;
INSERT INTO `tag_type` VALUES (1,'圖片',0);
/*!40000 ALTER TABLE `tag_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `web_list`
--

DROP TABLE IF EXISTS `web_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `web_list` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `sort_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `web_list`
--

LOCK TABLES `web_list` WRITE;
/*!40000 ALTER TABLE `web_list` DISABLE KEYS */;
INSERT INTO `web_list` VALUES (3,'cfd圖片',0);
/*!40000 ALTER TABLE `web_list` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-11-08 12:15:58
