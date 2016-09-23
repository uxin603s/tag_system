-- MySQL dump 10.15  Distrib 10.0.26-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: tag_system
-- ------------------------------------------------------
-- Server version	10.0.26-MariaDB

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
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `api_id` int(11) NOT NULL,
  `sort_id` int(11) NOT NULL,
  `type` int(11) NOT NULL COMMENT '0:標籤與標籤,1:標籤與資料',
  `sync_relation` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=130 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag_level`
--

LOCK TABLES `tag_level` WRITE;
/*!40000 ALTER TABLE `tag_level` DISABLE KEYS */;
INSERT INTO `tag_level` VALUES (128,7,0,0,0),(129,7,1,0,0);
/*!40000 ALTER TABLE `tag_level` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tag_list`
--

DROP TABLE IF EXISTS `tag_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tag_list` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `uid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag_list`
--

LOCK TABLES `tag_list` WRITE;
/*!40000 ALTER TABLE `tag_list` DISABLE KEYS */;
INSERT INTO `tag_list` VALUES (7,'會員用',0);
/*!40000 ALTER TABLE `tag_list` ENABLE KEYS */;
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
) ENGINE=MyISAM AUTO_INCREMENT=36 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag_name`
--

LOCK TABLES `tag_name` WRITE;
/*!40000 ALTER TABLE `tag_name` DISABLE KEYS */;
INSERT INTO `tag_name` VALUES (1,'第一層','2016-09-21 13:59:24',1474437564),(2,'咚咚','2016-09-21 13:59:36',1474437576),(3,'西西','2016-09-21 13:59:40',1474437580),(4,'qq','2016-09-21 13:59:44',1474437584),(5,'aa','2016-09-21 14:04:27',1474437867),(6,'bb','2016-09-21 14:04:38',1474437878),(7,'fff','2016-09-21 14:10:42',1474438242),(8,'fffgg','2016-09-21 14:10:49',1474438249),(9,'aaa','2016-09-21 14:24:26',1474439066),(10,'ff','2016-09-21 14:45:05',1474440305),(11,'ffbbb','2016-09-21 14:45:07',1474440307),(12,'ffbbbdfgdfgfdg','2016-09-21 14:45:12',1474440312),(13,'dddd','2016-09-21 14:56:04',1474440964),(14,'q','2016-09-21 15:01:17',1474441277),(15,'a','2016-09-21 15:04:34',1474441474),(16,'b','2016-09-21 15:04:52',1474441492),(17,'aaaa','2016-09-21 15:37:14',1474443434),(18,'t','2016-09-21 15:50:36',1474444236),(19,'tyy','2016-09-21 15:50:39',1474444239),(20,'tyytyutyuetu','2016-09-21 15:50:40',1474444240),(21,'tyytyutyueytuetyutu','2016-09-21 15:50:42',1474444242),(22,'吃','2016-09-21 22:58:03',1474469883),(23,'吃吃','2016-09-21 22:58:07',1474469887),(24,'bbb','2016-09-22 09:02:26',1474506146),(25,'nn','2016-09-22 09:21:56',1474507316),(26,'nnn','2016-09-22 09:21:57',1474507317),(27,'f','2016-09-22 09:53:54',1474509234),(28,'dd','2016-09-22 13:07:03',1474520823),(29,'ee','2016-09-22 13:08:11',1474520891),(30,'c','2016-09-22 13:12:02',1474521122),(31,'cc','2016-09-22 13:12:04',1474521124),(32,'ccc','2016-09-22 13:12:05',1474521125),(33,'d','2016-09-22 13:12:07',1474521127),(34,'ddd','2016-09-22 13:12:10',1474521130),(35,'cccc','2016-09-22 13:16:53',1474521413);
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
INSERT INTO `tag_relation` VALUES (6,888,129),(16,6,128),(16,24,128),(24,888,129);
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
INSERT INTO `tag_relation_count` VALUES (15,128,0),(24,129,0),(16,128,2),(6,129,0);
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

-- Dump completed on 2016-09-23 11:52:05
