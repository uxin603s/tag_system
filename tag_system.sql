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
-- Table structure for table `tag_level`
--

DROP TABLE IF EXISTS `tag_level`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tag_level` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'level_id',
  `sort_id` int(11) NOT NULL COMMENT '第一層為0',
  `tid` int(11) NOT NULL COMMENT 'tag_type表關聯',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag_level`
--

LOCK TABLES `tag_level` WRITE;
/*!40000 ALTER TABLE `tag_level` DISABLE KEYS */;
INSERT INTO `tag_level` VALUES (1,0,1),(2,1,1),(3,2,1);
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
) ENGINE=MyISAM AUTO_INCREMENT=18 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag_name`
--

LOCK TABLES `tag_name` WRITE;
/*!40000 ALTER TABLE `tag_name` DISABLE KEYS */;
INSERT INTO `tag_name` VALUES (1,'a','2016-11-23 21:09:29',1479906569),(2,'aa','2016-11-23 21:09:41',1479906581),(3,'aaa','2016-11-23 21:09:43',1479906583),(4,'b','2016-11-23 21:13:56',1479906836),(5,'bb','2016-11-23 21:14:00',1479906840),(6,'bbb','2016-11-23 21:14:04',1479906844),(7,'aaaa','2016-11-23 21:14:11',1479906851),(8,'bbbb','2016-11-23 21:14:14',1479906854),(9,'aaaaa','2016-11-23 21:14:16',1479906856),(10,'bbbbb','2016-11-23 21:14:19',1479906859),(11,'cc','2016-11-23 21:14:35',1479906875),(12,'sss','2016-11-23 22:53:16',1479912796),(13,'','2016-11-23 22:53:38',1479912818),(14,'ertert','2016-11-23 23:01:50',1479913310),(15,'ddd','2016-11-23 23:20:25',1479914425),(16,'qq','2016-11-23 23:21:00',1479914460),(17,'dd','2016-11-24 10:18:05',1479953885);
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
INSERT INTO `tag_relation` VALUES (0,1,1,0),(1,2,2,0),(2,3,3,0),(0,4,1,1),(4,5,2,0),(5,6,3,0),(2,7,3,1),(5,8,3,1),(2,9,3,2),(5,10,3,2),(4,11,2,1),(1,17,2,1);
/*!40000 ALTER TABLE `tag_relation` ENABLE KEYS */;
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
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag_type`
--

LOCK TABLES `tag_type` WRITE;
/*!40000 ALTER TABLE `tag_type` DISABLE KEYS */;
INSERT INTO `tag_type` VALUES (1,'主題',0),(2,'模板',1);
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
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `web_list`
--

LOCK TABLES `web_list` WRITE;
/*!40000 ALTER TABLE `web_list` DISABLE KEYS */;
INSERT INTO `web_list` VALUES (1,'cfd圖片',1),(2,'cfd模板',0);
/*!40000 ALTER TABLE `web_list` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `web_relation`
--

DROP TABLE IF EXISTS `web_relation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `web_relation` (
  `tid` int(11) NOT NULL,
  `source_id` int(11) NOT NULL,
  `wid` int(11) NOT NULL,
  `sort_id` int(11) NOT NULL,
  PRIMARY KEY (`tid`,`source_id`,`wid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `web_relation`
--

LOCK TABLES `web_relation` WRITE;
/*!40000 ALTER TABLE `web_relation` DISABLE KEYS */;
INSERT INTO `web_relation` VALUES (3,1,1,1),(11,2,1,1),(6,2,1,0),(6,1,1,0),(11,3,1,0),(3,3,1,1);
/*!40000 ALTER TABLE `web_relation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `web_tag_type`
--

DROP TABLE IF EXISTS `web_tag_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `web_tag_type` (
  `wid` int(11) NOT NULL,
  `tid` int(11) NOT NULL,
  `sort_id` int(11) NOT NULL,
  PRIMARY KEY (`wid`,`tid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `web_tag_type`
--

LOCK TABLES `web_tag_type` WRITE;
/*!40000 ALTER TABLE `web_tag_type` DISABLE KEYS */;
INSERT INTO `web_tag_type` VALUES (1,2,1),(1,1,0);
/*!40000 ALTER TABLE `web_tag_type` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-11-25 11:33:34
