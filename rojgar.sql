-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 07, 2025 at 09:07 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rojgar`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `Admin_Id` int(11) NOT NULL,
  `Admin_Name` varchar(255) DEFAULT NULL,
  `Admin_Password` varchar(255) NOT NULL,
  `created_at` date DEFAULT current_timestamp(),
  `updated_at` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`Admin_Id`, `Admin_Name`, `Admin_Password`, `created_at`, `updated_at`) VALUES
(1, 'Sanskar Jaiswal', '$2b$10$dWr1wzdbNBL4UbhzgxoadOL1ppqlMEXCqzVxOXewj0G9TUer7OeQq', '2025-03-24', '2025-03-24'),
(2, 'Sanskar', '$2b$10$nIZ4HWLKFQVtkFlyABJAIOBhC/dtyX/4751F.glcM9QMQ9Yk9OKVK', '2025-03-24', '2025-03-24');

-- --------------------------------------------------------

--
-- Table structure for table `applied_jobs`
--

CREATE TABLE `applied_jobs` (
  `job_applied_id` int(11) NOT NULL,
  `job_id` int(11) NOT NULL,
  `Company_Id` int(11) DEFAULT NULL,
  `work_location_type` varchar(501) DEFAULT NULL,
  `job_title` varchar(255) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `applied_jobs`
--

INSERT INTO `applied_jobs` (`job_applied_id`, `job_id`, `Company_Id`, `work_location_type`, `job_title`, `company_name`, `user_id`, `created_at`, `updatedAt`) VALUES
(12, 8, 29, NULL, 'sdf', 'ASCA', 56, '2025-03-25 13:31:37', '2025-03-25'),
(13, 11, 29, NULL, 'Backend Developer', 'ASCA', 56, '2025-03-25 13:40:26', '2025-03-25'),
(14, 14, 29, NULL, 'Full Stack Developer', 'ASCA', 56, '2025-03-25 18:47:30', '2025-03-25');

-- --------------------------------------------------------

--
-- Table structure for table `company_table`
--

CREATE TABLE `company_table` (
  `Company_Id` int(11) NOT NULL,
  `Company_User_Name` varchar(100) DEFAULT NULL,
  `Company_Name` varchar(255) DEFAULT NULL,
  `Company_Type` varchar(100) DEFAULT NULL,
  `Country_Code` varchar(20) DEFAULT NULL,
  `Mobile_Number` varchar(15) NOT NULL,
  `Company_Email` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `Company_Logo` varchar(255) DEFAULT NULL,
  `Company_Website` varchar(255) DEFAULT NULL,
  `Company_Description` text DEFAULT NULL,
  `Company_Status` enum('Active','Inactive','Pending') NOT NULL DEFAULT 'Inactive',
  `Company_Start_Date` date DEFAULT NULL,
  `Company_Address` text DEFAULT NULL,
  `Latitude` decimal(10,6) DEFAULT NULL,
  `Longitude` decimal(10,6) DEFAULT NULL,
  `Company_Gov_Docs` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `FCM_ID` varchar(255) DEFAULT NULL,
  `Device_ID` varchar(255) DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expires` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `company_table`
--

INSERT INTO `company_table` (`Company_Id`, `Company_User_Name`, `Company_Name`, `Company_Type`, `Country_Code`, `Mobile_Number`, `Company_Email`, `password`, `Company_Logo`, `Company_Website`, `Company_Description`, `Company_Status`, `Company_Start_Date`, `Company_Address`, `Latitude`, `Longitude`, `Company_Gov_Docs`, `createdAt`, `updatedAt`, `FCM_ID`, `Device_ID`, `reset_token`, `reset_token_expires`) VALUES
(29, 'Sanskar Jaiswal', 'ASCA', 'Technical', '+91', '8305712353', 'sjjjaiswal110@gmail.com', '$2b$10$J06hbSCebIRcecy.wyFGp.BKo.LqwuqeK6E6eUNXmwF3vFxvFveNS', 'uploads\\1741422229729-556015706.png', 'www.s.com', 'ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss', 'Inactive', '2025-03-01', '4 sarvsampan nagar', 70.000000, 70.000000, 'uploads\\1741422229738-180456594.png', '2025-03-08 08:23:49', '2025-03-23 13:50:26', NULL, NULL, NULL, NULL),
(31, 'Sanskar New', 'Logical Softech', 'Technical', '+91', '9516563284', 'r@gmail.com', '$2b$10$7mc52dE0k7KKZVm1kJW43ubNmS.ae2D/1/rOUt5ePe/Xu8LMDCk3a', 'uploads\\1742880399801-Admin_section.png', 'www.s.com', 'This is DescriptionsjashdkasjhdkashdjahkdashkdhaskdhThis is DescriptionsjashdkasjhdkashdjahkdashkdhaskdhThis is DescriptionsjashdkasjhdkashdjahkdashkdhaskdhThis is DescriptionsjashdkasjhdkashdjahkdashkdhaskdhThis is DescriptionsjashdkasjhdkashdjahkdashkdhaskdhThis is DescriptionsjashdkasjhdkashdjahkdashkdhaskdhThis is Descriptionsjashdkasjhdkashdjahkdashkdhaskdh', 'Inactive', '2025-03-04', 'jsdjkahdasjhd', 70.000000, 70.000000, 'uploads\\1742880399802-Usersection.png', '2025-03-25 05:26:39', '2025-03-25 05:26:39', NULL, NULL, NULL, NULL),
(32, 'Sanskar', 'Logical ', 'Technical', '+91', '9516563294', 'a@h.com', '$2b$10$yZWaaES1BcxDoIQ9bjJJjeh0rvfq6HTvTOFaZUc1mMGT/y4uKCk0G', 'uploads\\1742880809134-Admin_section.png', 'www.s.com', 'This is Description of Logical Softech company an IT company This is Description of Logical Softech company an IT company This is Description of Logical Softech company an IT company This is Description of Logical Softech company an IT company This is Description of Logical Softech company an IT company ', 'Inactive', '2025-03-04', 'This is addres', 70.000000, 70.000000, 'uploads\\1742880809135-Usersection.png', '2025-03-25 05:33:29', '2025-03-25 05:33:29', NULL, NULL, NULL, NULL),
(33, 'Satyam Jain', 'Swiggy', 'Non Technical', '+91', '9399044004', 'shdjasd@gmail.com', '$2b$10$n6BMAuMmPEZnHc0PjngCceNG/rfuXgigoqrLflO3YV9MRDZMHqoGG', 'uploads\\1742901816363-printing-website-3.png', 'www.gdhakjhs.com', 'This is Description This is Description This is Description This is Description This is Description This is Description This is Description This is Description This is Description This is Description This is Description This is Description This is Description This is Description ', 'Inactive', '2025-03-25', 'This is address', 70.000000, 70.000000, 'uploads\\1742901816368-Land Purchase.png', '2025-03-25 11:23:36', '2025-03-25 11:23:36', NULL, NULL, NULL, NULL),
(34, 'Ajay Sir', 'Zomato', 'Technical', '+91', '9399044007', 'a1@h.com', '$2b$10$UrrrmvOylGjbDbDkJhU.JuNbUuPAWfagK8ZMKN5EE2PsviaDSuLCK', 'uploads\\1743059362415-Land Purchase.png', 'www.godaady.com', 'This is DescriptionThis is DescriptionThis is DescriptionThis is DescriptionThis is DescriptionThis is DescriptionThis is DescriptionThis is DescriptionThis is DescriptionThis is DescriptionThis is DescriptionThis is DescriptionThis is DescriptionThis is DescriptionThis is DescriptionThis is Description', 'Inactive', '2025-03-11', 'THis is Address', 1.000000, 1.000000, 'uploads\\1743059362452-Land Purchase.png', '2025-03-27 07:09:22', '2025-03-27 08:10:45', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `job_id` int(11) NOT NULL,
  `Company_Id` int(20) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `job_title` varchar(255) DEFAULT NULL,
  `job_type` enum('Full Time','Part Time','Contract','Internship','Freelance') DEFAULT NULL,
  `night_shift` tinyint(1) DEFAULT NULL,
  `work_location_type` enum('Work From Office','Work From Home','Hybrid') DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `City` varchar(255) DEFAULT NULL,
  `State` varchar(255) DEFAULT NULL,
  `Country` varchar(255) DEFAULT NULL,
  `pay_type` enum('Fixed Only','Fixed + Incentive','Incentive Only') DEFAULT NULL,
  `salary` varchar(255) DEFAULT NULL,
  `Experience_Years` int(11) DEFAULT NULL,
  `perks` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`perks`)),
  `joining_fee` decimal(10,2) DEFAULT NULL,
  `joinFee` varchar(255) DEFAULT NULL,
  `minimum_education` varchar(255) DEFAULT NULL,
  `english_level` enum('Beginner','Intermediate','Advanced','Fluent') DEFAULT NULL,
  `total_experience` varchar(255) DEFAULT NULL,
  `additional_requirements` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`additional_requirements`)),
  `job_description` varchar(2000) DEFAULT NULL,
  `walk_in_interview` varchar(255) DEFAULT NULL,
  `contact_preference` enum('Yes, to myself','Yes, to other recruiter','recruiter will call') DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`job_id`, `Company_Id`, `company_name`, `job_title`, `job_type`, `night_shift`, `work_location_type`, `location`, `City`, `State`, `Country`, `pay_type`, `salary`, `Experience_Years`, `perks`, `joining_fee`, `joinFee`, `minimum_education`, `english_level`, `total_experience`, `additional_requirements`, `job_description`, `walk_in_interview`, `contact_preference`, `created_at`, `updated_at`) VALUES
(8, 29, 'ASCA', 'sdf', 'Full Time', 0, 'Work From Office', 'sdfsfsfsa', NULL, NULL, NULL, 'Fixed Only', '45000', NULL, '\"[]\"', 0.00, NULL, '10th Or Below 10th', 'Beginner', 'Any', '\"{\\\"gender\\\":\\\"\\\",\\\"age\\\":{\\\"min\\\":\\\"\\\",\\\"max\\\":\\\"\\\"},\\\"distance\\\":\\\"\\\",\\\"regionalLanguages\\\":\\\"\\\",\\\"assets\\\":\\\"\\\",\\\"skills\\\":\\\"\\\"}\"', 'asfasfffffffffffffffsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss', 'Yes', 'Yes, to myself', '2025-03-06 14:11:24', '2025-03-06 14:11:24'),
(10, 29, 'ASCA', 'Frontend Developer', 'Full Time', 0, 'Work From Office', 'sadasd', NULL, NULL, NULL, 'Fixed Only', '10k', NULL, '\"[\\\"Overtime Pay\\\"]\"', 0.00, NULL, '10th Or Below 10th', 'Beginner', 'Any', '\"{\\\"gender\\\":\\\"Male\\\",\\\"age\\\":{\\\"min\\\":\\\"\\\",\\\"max\\\":\\\"\\\"},\\\"distance\\\":\\\"\\\",\\\"regionalLanguages\\\":\\\"\\\",\\\"assets\\\":\\\"\\\",\\\"skills\\\":\\\"\\\"}\"', 'scasdadadasdsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss', 'Yes', 'Yes, to myself', '2025-03-07 05:48:10', '2025-03-07 05:48:10'),
(11, 29, 'ASCA', 'Backend Developer', 'Full Time', 0, 'Work From Office', 'sadasd', NULL, NULL, NULL, 'Fixed Only', '50K', NULL, '\"[\\\"Overtime Pay\\\"]\"', 0.00, NULL, '10th Or Below 10th', 'Beginner', 'Any', '\"{\\\"gender\\\":\\\"Male\\\",\\\"age\\\":{\\\"min\\\":\\\"\\\",\\\"max\\\":\\\"\\\"},\\\"distance\\\":\\\"\\\",\\\"regionalLanguages\\\":\\\"\\\",\\\"assets\\\":\\\"\\\",\\\"skills\\\":\\\"\\\"}\"', 'scasdadadasdsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss', 'Yes', 'Yes, to myself', '2025-03-07 05:50:32', '2025-03-07 05:50:32'),
(14, 29, 'ASCA', 'Full Stack Developer', 'Full Time', 0, 'Work From Office', 'Sarv Sampan Nagar', NULL, NULL, NULL, 'Fixed Only', '100K', NULL, '\"[]\"', 0.00, NULL, 'Post Graduate', 'Advanced', 'Experienced Only', '\"{\\\"gender\\\":\\\"\\\",\\\"age\\\":{\\\"min\\\":\\\"\\\",\\\"max\\\":\\\"\\\"},\\\"distance\\\":\\\"\\\",\\\"regionalLanguages\\\":\\\"\\\",\\\"assets\\\":\\\"\\\",\\\"skills\\\":\\\"\\\"}\"', 'This is a Job Description Page to test Job Posting jajdadjklasjdlkdjaslkdjkdjjdkjdljdkljdaljdasjasldjkaskdasldssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss', 'Yes', 'Yes, to myself', '2025-03-12 06:22:15', '2025-03-12 06:22:15'),
(16, 29, 'ASCA', 'Software Engineer', 'Full Time', 0, 'Work From Office', 'This is Adress', NULL, NULL, NULL, 'Fixed Only', '100K', NULL, '\"[]\"', 0.00, NULL, 'Post Graduate', 'Fluent', 'Experienced Only', '\"{\\\"gender\\\":\\\"\\\",\\\"age\\\":{\\\"min\\\":\\\"\\\",\\\"max\\\":\\\"\\\"},\\\"distance\\\":\\\"\\\",\\\"regionalLanguages\\\":\\\"\\\",\\\"assets\\\":\\\"\\\",\\\"skills\\\":\\\"\\\"}\"', 'This is description ksdskd;askda;kda;lkd;aslkd;lakd;aslk;aslkda;lskda;slkdas;lkdas;ldkas;ldkas;lkdas;lkd;laskda;lskda;lskdas;lkdassssssssssssssssssssssssssssssssssssssssssssssssssssssss', 'Yes', 'Yes, to myself', '2025-03-12 07:08:14', '2025-03-12 07:08:14'),
(17, 29, 'ASCA', 'Testing data', 'Full Time', 1, 'Work From Office', '', NULL, NULL, NULL, 'Fixed Only', '50K', NULL, '\"[\\\"Flexible Working Hours\\\",\\\"Overtime Pay\\\",\\\"Weekly Payout\\\",\\\"Joining Bonus\\\",\\\"PF\\\",\\\"Petrol Allowance\\\"]\"', 0.00, NULL, '12th Pass', 'Intermediate', 'Experienced Only', '\"{\\\"gender\\\":\\\"\\\",\\\"age\\\":{\\\"min\\\":\\\"\\\",\\\"max\\\":\\\"\\\"},\\\"distance\\\":\\\"\\\",\\\"regionalLanguages\\\":\\\"english\\\",\\\"assets\\\":\\\"\\\",\\\"skills\\\":\\\"\\\"}\"', '', 'Yes', 'Yes, to myself', '2025-03-17 07:38:46', '2025-03-17 07:38:46'),
(18, 29, 'ASCA', 'Backend Developer', 'Full Time', 0, 'Work From Office', 'Mahu Naka', NULL, NULL, NULL, 'Fixed + Incentive', '50K - 100K', NULL, '\"[]\"', 0.00, NULL, 'Graduate', 'Advanced', 'Experienced Only', '\"{\\\"gender\\\":\\\"\\\",\\\"age\\\":{\\\"min\\\":\\\"\\\",\\\"max\\\":\\\"\\\"},\\\"distance\\\":\\\"\\\",\\\"regionalLanguages\\\":\\\"\\\",\\\"assets\\\":\\\"\\\",\\\"skills\\\":\\\"\\\"}\"', 'ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss\nssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss\nssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss', 'Yes', 'Yes, to other recruiter', '2025-03-17 12:11:00', '2025-03-17 12:11:00'),
(19, 29, 'ASCA', 'Backend Developer', 'Full Time', 0, 'Work From Home', 'This is Address', NULL, NULL, NULL, 'Fixed Only', '50K', NULL, '\"[\\\"Flexible Working Hours\\\",\\\"Overtime Pay\\\",\\\"Annual Bonus\\\"]\"', 0.00, NULL, 'Post Graduate', 'Advanced', 'Experienced Only', '{\"gender\":\"\",\"age\":{\"min\":\"\",\"max\":\"\"},\"distance\":\"\",\"regionalLanguages\":\"\",\"assets\":\"\",\"skills\":\"\"}', 'This is jon descripton This is jon descripton This is jon descripton This is jon descripton This is jon descripton This is jon descripton This is jon descripton This is jon descripton This is jon descripton ', 'Yes', 'Yes, to myself', '2025-03-22 10:11:08', '2025-03-22 10:11:08'),
(20, 29, 'ASCA', 'Frontend Developer', 'Full Time', 0, 'Work From Office', 'This is Address', NULL, NULL, NULL, 'Fixed Only', '50K', NULL, '\"[]\"', 0.00, NULL, 'Post Graduate', 'Advanced', 'Experienced Only', '{\"gender\":\"\",\"age\":{\"min\":\"\",\"max\":\"\"},\"distance\":\"\",\"regionalLanguages\":\"\",\"assets\":\"\",\"skills\":\"\"}', 'This is description dasldjasldjalsjThis is description dasldjasldjalsjThis is description dasldjasldjalsjThis is description dasldjasldjalsjThis is description dasldjasldjalsjThis is description dasldjasldjalsj', 'Yes', 'Yes, to myself', '2025-03-22 10:13:43', '2025-03-22 10:13:43'),
(21, 29, 'ASCA', 'Backend Developer', 'Full Time', 0, 'Work From Office', 'scasca', NULL, NULL, NULL, 'Fixed Only', '50K', NULL, '\"[]\"', 0.00, NULL, 'Post Graduate', 'Advanced', 'Experienced Only', '{\"gender\":\"\",\"age\":{\"min\":\"\",\"max\":\"\"},\"distance\":\"\",\"regionalLanguages\":\"\",\"assets\":\"\",\"skills\":\"\"}', 'This is Job DescriptionThis is Job DescriptionThis is Job DescriptionThis is Job DescriptionThis is Job DescriptionThis is Job DescriptionThis is Job DescriptionThis is Job DescriptionThis is Job DescriptionThis is Job Description', 'Yes', 'Yes, to myself', '2025-03-23 17:48:03', '2025-03-23 17:48:03'),
(22, 29, 'ASCA', 'Backend Developer', 'Full Time', 0, 'Work From Home', 'This s adress', 'Indore', 'Madhya_Pradesh', 'India', 'Fixed Only', '50K', NULL, '\"[]\"', 0.00, NULL, '10th Or Below 10th', 'Intermediate', 'Experienced Only', '{\"gender\":\"\",\"age\":{\"min\":\"\",\"max\":\"\"},\"distance\":\"\",\"regionalLanguages\":\"\",\"assets\":\"\",\"skills\":[]}', 'This is Job Description This is Job Description This is Job Description This is Job Description This is Job Description This is Job Description This is Job Description This is Job Description This is Job Description This is Job Description ', 'Yes', 'Yes, to myself', '2025-03-26 04:44:04', '2025-03-26 04:44:04');

-- --------------------------------------------------------

--
-- Table structure for table `reported`
--

CREATE TABLE `reported` (
  `Report_Id` int(11) NOT NULL,
  `Report_Of` varchar(255) DEFAULT NULL,
  `Reported_By` varchar(255) DEFAULT NULL,
  `Reported_By_Id` int(11) DEFAULT NULL,
  `Report_Text` longtext DEFAULT NULL,
  `created_at` date DEFAULT current_timestamp(),
  `updated_at` date DEFAULT NULL,
  `Report_Of_Id` int(11) DEFAULT NULL,
  `Report_Sub` varchar(255) DEFAULT NULL,
  `Report_Status` varchar(255) DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reported`
--

INSERT INTO `reported` (`Report_Id`, `Report_Of`, `Reported_By`, `Reported_By_Id`, `Report_Text`, `created_at`, `updated_at`, `Report_Of_Id`, `Report_Sub`, `Report_Status`) VALUES
(1, 'Company', 'User', 56, 'This company is violating policies.', '2025-03-26', '2025-03-26', 29, 'Policy Violation', 'Pending');

-- --------------------------------------------------------

--
-- Table structure for table `reporteds`
--

CREATE TABLE `reporteds` (
  `Report_Id` int(11) NOT NULL,
  `Report_Of` varchar(255) DEFAULT NULL,
  `Reported_By` varchar(255) DEFAULT NULL,
  `Reported_By_Id` int(11) DEFAULT NULL,
  `Report_Text` text DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `Report_Of_Id` int(11) DEFAULT NULL,
  `Report_Sub` varchar(255) DEFAULT NULL,
  `Report_Status` varchar(255) DEFAULT 'Pending',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reporteds`
--

INSERT INTO `reporteds` (`Report_Id`, `Report_Of`, `Reported_By`, `Reported_By_Id`, `Report_Text`, `created_at`, `updated_at`, `Report_Of_Id`, `Report_Sub`, `Report_Status`, `createdAt`, `updatedAt`) VALUES
(1, 'Company', 'User', 56, 'This company is violating policies.', '2025-03-26 17:37:18', NULL, 29, 'Policy Violation', 'Pending', '2025-03-26 17:37:18', '2025-03-26 17:37:18'),
(2, 'Company', 'User', 56, 'This company is violating policies.', '2025-03-26 17:38:37', NULL, 29, 'Policy Violation', 'Pending', '2025-03-26 17:38:37', '2025-03-26 17:38:37'),
(3, 'Company', 'User', 56, 'This company is violating policies.', '2025-03-26 17:38:41', NULL, 29, 'Policy Violation', 'Pending', '2025-03-26 17:38:41', '2025-03-26 17:38:41'),
(4, 'Company', 'User', 56, 'This company is violating policies.', '2025-03-26 17:38:46', NULL, 29, 'Policy Violation', 'Pending', '2025-03-26 17:38:46', '2025-03-26 17:38:46'),
(5, 'Company', 'User', 56, 'This company is violating policies.', '2025-03-26 17:40:14', NULL, 29, 'Policy Violation', 'Pending', '2025-03-26 17:40:14', '2025-03-26 17:40:14');

-- --------------------------------------------------------

--
-- Table structure for table `subscription`
--

CREATE TABLE `subscription` (
  `Sub_Id` int(11) NOT NULL,
  `Sub_Name` varchar(255) DEFAULT NULL,
  `Sub_Amount` int(11) DEFAULT NULL,
  `Sub_By` varchar(255) DEFAULT NULL,
  `Id` int(11) DEFAULT NULL,
  `created_at` date DEFAULT current_timestamp(),
  `updated_at` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `suggestions table`
--

CREATE TABLE `suggestions table` (
  `Sug_Id` int(11) NOT NULL,
  `Sug_Name` varchar(255) DEFAULT NULL,
  `Suggestions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`Suggestions`)),
  `Sug_Type` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `suggestions_table`
--

CREATE TABLE `suggestions_table` (
  `Sug_Id` int(11) NOT NULL,
  `Sug_Name` varchar(255) DEFAULT NULL,
  `Suggestions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`Suggestions`)),
  `Sug_Type` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `suggestions_table`
--

INSERT INTO `suggestions_table` (`Sug_Id`, `Sug_Name`, `Suggestions`, `Sug_Type`) VALUES
(1, 'Job_Role_Want', '[{\"id\":1,\"name\":\"Field Sales\",\"img\":\"https://static.jobhai.com/backend/category_public_image/field_sales.webp\"},{\"id\":2,\"name\":\"Back Office / Data Entry\",\"img\":\"https://static.jobhai.com/backend/category_public_image/field_sales.webp\"},{\"id\":3,\"name\":\"Sales / Business Development\",\"img\":\"https://static.jobhai.com/backend/category_public_image/sales_business_development.webp\"},{\"id\":4,\"name\":\"Customer Support / TeleCaller\",\"img\":\"https://static.jobhai.com/backend/category_public_image/customer_support_telecaller.webp\"},{\"id\":5,\"name\":\"Delivery\",\"img\":\"https://static.jobhai.com/backend/category_public_image/delivery.webp\"},{\"id\":6,\"name\":\"Telesales / Telemarketing\",\"img\":\"https://static.jobhai.com/backend/category_public_image/telesales_telemarketing.webp\"},{\"id\":7,\"name\":\"Accountant\",\"img\":\"https://static.jobhai.com/backend/category_public_image/accountant.webp\"},{\"id\":8,\"name\":\"Warehouse / Logistics\",\"img\":\"https://static.jobhai.com/backend/category_public_image/warehouse_logistics.webp\"},{\"id\":9,\"name\":\"Retail / Counter Sales\",\"img\":\"https://static.jobhai.com/backend/category_public_image/retail.webp\"},{\"id\":10,\"name\":\"Recruiter / HR / Admin\",\"img\":\"https://static.jobhai.com/backend/category_public_image/recruiter_hr_admin.webp\"}]', 'User Side'),
(2, 'Industry Categories', '[\"Finance\",\"Healthcare\",\"IT Services\",\"Education\",\"Real Estate\",\"Retail\",\"Manufacturing\",\"Telecommunications\",\"Energy\",\"Agriculture\",\"Transportation\",\"Entertainment\",\"E-commerce\",\"Automobile\",\"Pharmaceuticals\"]', 'Business Sectors');

-- --------------------------------------------------------

--
-- Table structure for table `user_table`
--

CREATE TABLE `user_table` (
  `user_id` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Gender` varchar(50) DEFAULT NULL,
  `Education_Details` longtext DEFAULT NULL,
  `Education_level` varchar(255) DEFAULT NULL,
  `Experience_Years` varchar(255) DEFAULT NULL,
  `Experience_Details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`Experience_Details`)),
  `City` varchar(255) DEFAULT NULL,
  `Job_Role_Want` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`Job_Role_Want`)),
  `Email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `Country_Code` text DEFAULT NULL,
  `Mobile_Number` varchar(20) NOT NULL,
  `Date_of_Birth` datetime DEFAULT NULL,
  `Current_Location` varchar(255) DEFAULT NULL,
  `Created_At` datetime DEFAULT NULL,
  `Updated_At` datetime DEFAULT NULL,
  `FCM_ID` varchar(255) DEFAULT NULL,
  `Device_ID` varchar(255) DEFAULT NULL,
  `Skills` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `user_image` varchar(501) DEFAULT NULL,
  `Certificates` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`Certificates`)),
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expires` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_table`
--

INSERT INTO `user_table` (`user_id`, `Name`, `Gender`, `Education_Details`, `Education_level`, `Experience_Years`, `Experience_Details`, `City`, `Job_Role_Want`, `Email`, `password`, `Country_Code`, `Mobile_Number`, `Date_of_Birth`, `Current_Location`, `Created_At`, `Updated_At`, `FCM_ID`, `Device_ID`, `Skills`, `user_image`, `Certificates`, `reset_token`, `reset_token_expires`) VALUES
(56, 'Sanskar Jaiswal', 'Male', '[{\"degree\":\"Bachelor of Technology (B.Tech.)\",\"field\":\"Mechanical Engineering\",\"university\":\"University of Oxford\",\"startDate\":\"2025-03-11\",\"endDate\":\"2025-03-18\",\"studying\":false}]', 'Graduate', '5+ years', '[{\"title\":\"Backend Developer\",\"role\":\"Projrct Leader\",\"company\":\"Asda\",\"industry\":\"IT Services\",\"startDate\":\"2025-01-01T00:00:00.000Z\",\"endDate\":\"2025-03-11T00:00:00.000Z\",\"currentlyWorking\":false,\"duration\":\"0 years, 2 months\",\"employmentType\":\"Full Time\",\"description\":\"This is description This is description This is description This is description This is description This is description This is description This is description This is description This is description This is description This is description This is description This is description \"}]', 'Indore', '[\"Warehouse / Logistics\",\"Accountant\",\"Retail / Counter Sales\",\"Telesales / Telemarketing\"]', 'sjjjais110@gmail.com', '$2b$10$GskQq3TU9REIVHnUWLySMe3ihVTenvsJfuwVViptUOeCYgLUa2WWS', '+91', '8305712355', '2009-01-01 00:00:00', 'Indore', '2025-03-07 11:18:20', '2025-03-27 09:20:31', NULL, NULL, '[\"React\",\"Node.js\",\"JavaScript\",\"HTML\",\"Python\"]', NULL, '[{\"certification\":\"Mern Full Stack Code\",\"org\":\"ada\",\"issueDate\":\"2025-01-07\",\"expiryDate\":\"2025-03-11\",\"certificateAlways\":false},{\"certification\":\"Java Full Stack\",\"org\":\"ada\",\"issueDate\":\"2025-01-25\",\"expiryDate\":\"2025-03-10\",\"certificateAlways\":false}]', '9384156', '2025-03-27'),
(58, 'Sarthak Jaiswal', 'Male', NULL, '10th Pass', '5+ years', NULL, 'Indore', '[\"Field Sales\",\"Back Office / Data Entry\",\"Telesales / Telemarketing\"]', 'ohmtechdevelopers@gmail.com', '$2b$10$AfefPNY2JTbaiGdKj3tWJeukai9EZzjKJL0Fun44ZyL7/0lPWuzWu', '+91', '7805015347', '2007-08-18 00:00:00', NULL, '2025-03-13 15:41:57', '2025-03-13 15:41:57', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(59, 'anju', 'Female', NULL, 'Graduate', '1-6 months', NULL, 'Indore', '[\"Recruiter / HR / Admin\",\"Retail / Counter Sales\",\"Recruiter / HR / Admin\",\"Sales / Business Development\",\"Back Office / Data Entry\"]', 'anju@gmail.com', '$2b$10$OQJ5MqEbtWXmTEuzsLRaLOTr1fy4SD5zynNAWzg3bPzwDD8YY42lu', '+91', '7992345857', '1995-05-11 00:00:00', NULL, '2025-03-17 07:22:31', '2025-03-17 07:22:31', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(60, 'Dhananjay Sir', 'Male', NULL, 'Post Graduate', '5+ years', NULL, 'Indore', '[\"Field Sales\",\"Back Office / Data Entry\",\"Sales / Business Development\"]', 'rghs9513@gmail.com', '$2b$10$KpBYK.l3TGnQRf0TU5hnSuYotf84J6APPNhG/ZxnPjx1yWJYiSQb2', '+91', '9993773206', '2000-01-01 00:00:00', NULL, '2025-03-22 06:28:53', '2025-03-22 06:42:37', NULL, NULL, '[\"Node.js\",\"React\"]', NULL, NULL, NULL, NULL),
(62, 'Satyam Jain', 'Male', NULL, 'Graduates', '3 years', '[{\"title\":\"Backend Developer\",\"role\":\"Sr. php developers\",\"company\":\"Logical Softech\",\"industry\":\"IT software\",\"startDate\":\"2024-01-01T00:00:00.000Z\",\"endDate\":null,\"currentlyWorking\":true,\"duration\":\"1 years, 2 months\",\"employmentType\":\"Full Time\",\"description\":\"i have more than 5 years experience in php an cI also i have good knowledge in laravel and database i have hug of experience in firebase and push notification.\"}]', 'Indore', '[\"Field Sales\",\"Back Office / Data Entry\",\"Sales / Business Development\",\"Customer Support / TeleCaller\",\"Recruiter / HR / Admin\",\"Retail / Counter Sales\"]', 'logical@gmail.com', '$2b$10$N8DJLdQcBskjbCxG4lkcAOOAd4j4T/R2l6XGTy6QyRipMtnsdLvBm', '+91', '7992345852', '2010-01-14 00:00:00', 'Indore', '2025-03-27 12:11:02', '2025-03-27 13:14:45', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(63, 'Sanskar Jaiswal', 'Male', NULL, 'Post Graduate', '2 years', NULL, 'Indore', '[\"Field Sales\",\"Field Sales\",\"Back Office / Data Entry\",\"Sales / Business Development\"]', 'sansjayaswal@gmail.com', '$2b$10$aKdUVwFRvt5//Uo46iKDWuWZgR5qybyhkehO6M.PVIw1vErwU6Zb2', '+91', '+918305712353', '2003-02-22 00:00:00', NULL, '2025-03-30 19:13:26', '2025-03-30 19:13:26', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(64, 'Nitish Jain ', 'Male', NULL, 'Post Graduate', '5+ years', NULL, 'Indore', '[\"Delivery\",\"Telesales / Telemarketing\",\"Accountant\"]', 'ohmteechdevelopers@gmail.com', '$2b$10$apJ.Ib5CxvAGgAD7YquFd.SvQ528vtj.jOtXS0T8C.cInVKOMyoSS', '+91', '8305712359', '2007-03-07 00:00:00', NULL, '2025-03-30 19:20:32', '2025-03-30 19:20:32', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(65, 'New developer', 'Male', NULL, 'Post Graduate', '5+ years', NULL, 'Indore', '[\"Delivery\",\"Telesales / Telemarketing\"]', 'sjjjaiswal110@gmail.com', '$2b$10$JBEuwstiAO4ytXemwpcEgewTYQl3ShKxm/AysVkWrYXOgMCbkazry', '+91', '8305712353', '2007-03-01 00:00:00', NULL, '2025-03-30 19:32:20', '2025-03-30 19:32:20', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(66, 'Sanskar Jaiswal', 'Male', NULL, 'Below 10th', '5+ years', NULL, 'Indore', '[\"Telesales / Telemarketing\",\"Delivery\",\"Customer Support / TeleCaller\",\"Sales / Business Development\"]', 'sanjayaswal2003@gmail.com', '$2b$10$20TagzXFMrQc4tg/hN9etO/bf3qSw1l0W3UcRkQY7cs154bEts/Ui', '+91', '8305712350', '2007-03-15 00:00:00', NULL, '2025-03-31 10:01:11', '2025-03-31 10:01:11', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(67, 'Sarthak Jaiswal', 'Male', NULL, 'Post Graduate', '5+ years', NULL, 'Indore', '[\"Delivery\",\"Telesales / Telemarketing\"]', 'sanjayswal2003@gmail.com', '$2b$10$P72qYo/TiYrBec1doq7IKuUF5IXYBXN1smtvzz3QlIzMV1XBWTtEq', '91', '9516563251', '2007-03-07 00:00:00', NULL, '2025-03-31 10:13:22', '2025-03-31 10:13:22', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(68, 'Aniket Soni', 'Male', NULL, 'Post Graduate', '5+ years', NULL, 'Indore', '[\"Telesales / Telemarketing\",\"Delivery\"]', 'sanayswal2003@gmail.com', '$2b$10$ihORePuVRguJVKiViT4F3.ZTcKr0fKYBdk.CYs11I/aniffXe397a', '91', '9516563101', '2007-03-07 00:00:00', NULL, '2025-03-31 10:16:37', '2025-03-31 10:16:37', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(75, 'Sanskar Jaiswal', 'Male', NULL, 'Post Graduate', '5+ years', NULL, 'Indore', '[\"Field Sales\",\"Back Office / Data Entry\",\"Sales / Business Development\"]', 'sanskarjaiswal003@gmail.com', '$2b$10$fw3PAJXa0oNAnsGU4NKxVuJaewjmklwgH8AZ78vT7z4978YTLyq1e', '91', '8815028745', '2007-04-04 00:00:00', NULL, '2025-04-07 18:47:01', '2025-04-07 18:47:01', '$2b$10$Ps9Kxn2GyOy4UBMlwG0GVuy1PHCxyQL6ea/.P6uSWdM8GmPo7tRh.', NULL, NULL, NULL, NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`Admin_Id`),
  ADD UNIQUE KEY `Admin_Name` (`Admin_Name`);

--
-- Indexes for table `applied_jobs`
--
ALTER TABLE `applied_jobs`
  ADD PRIMARY KEY (`job_applied_id`),
  ADD KEY `job_id` (`job_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `company_table`
--
ALTER TABLE `company_table`
  ADD PRIMARY KEY (`Company_Id`),
  ADD UNIQUE KEY `Company_User_Name` (`Company_User_Name`),
  ADD UNIQUE KEY `Mobile_Number` (`Mobile_Number`),
  ADD UNIQUE KEY `Company_Email` (`Company_Email`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`job_id`);

--
-- Indexes for table `reported`
--
ALTER TABLE `reported`
  ADD PRIMARY KEY (`Report_Id`);

--
-- Indexes for table `reporteds`
--
ALTER TABLE `reporteds`
  ADD PRIMARY KEY (`Report_Id`);

--
-- Indexes for table `subscription`
--
ALTER TABLE `subscription`
  ADD PRIMARY KEY (`Sub_Id`);

--
-- Indexes for table `suggestions_table`
--
ALTER TABLE `suggestions_table`
  ADD PRIMARY KEY (`Sug_Id`),
  ADD UNIQUE KEY `Sug_Name` (`Sug_Name`);

--
-- Indexes for table `user_table`
--
ALTER TABLE `user_table`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `Email_2` (`Email`),
  ADD UNIQUE KEY `Mobile_Number_2` (`Mobile_Number`),
  ADD UNIQUE KEY `Email_7` (`Email`),
  ADD UNIQUE KEY `Mobile_Number_7` (`Mobile_Number`),
  ADD UNIQUE KEY `Mobile_Number_9` (`Mobile_Number`),
  ADD UNIQUE KEY `Mobile_Number_10` (`Mobile_Number`),
  ADD UNIQUE KEY `Email_11` (`Email`),
  ADD UNIQUE KEY `Mobile_Number_11` (`Mobile_Number`),
  ADD UNIQUE KEY `Email_12` (`Email`),
  ADD UNIQUE KEY `Mobile_Number_12` (`Mobile_Number`),
  ADD UNIQUE KEY `Mobile_Number_13` (`Mobile_Number`),
  ADD UNIQUE KEY `Mobile_Number_14` (`Mobile_Number`),
  ADD UNIQUE KEY `Email_15` (`Email`),
  ADD UNIQUE KEY `Mobile_Number_15` (`Mobile_Number`),
  ADD UNIQUE KEY `Email_16` (`Email`),
  ADD UNIQUE KEY `Mobile_Number_16` (`Mobile_Number`),
  ADD UNIQUE KEY `Email_17` (`Email`),
  ADD UNIQUE KEY `Email_18` (`Email`),
  ADD UNIQUE KEY `Mobile_Number_18` (`Mobile_Number`),
  ADD UNIQUE KEY `Email_19` (`Email`),
  ADD UNIQUE KEY `Mobile_Number_19` (`Mobile_Number`),
  ADD UNIQUE KEY `Email_20` (`Email`),
  ADD UNIQUE KEY `Mobile_Number_20` (`Mobile_Number`),
  ADD UNIQUE KEY `Email_21` (`Email`),
  ADD UNIQUE KEY `Mobile_Number_21` (`Mobile_Number`),
  ADD UNIQUE KEY `Email_22` (`Email`),
  ADD UNIQUE KEY `Email_23` (`Email`),
  ADD UNIQUE KEY `Mobile_Number_23` (`Mobile_Number`),
  ADD UNIQUE KEY `Email_24` (`Email`),
  ADD UNIQUE KEY `Mobile_Number_24` (`Mobile_Number`),
  ADD UNIQUE KEY `Mobile_Number_25` (`Mobile_Number`),
  ADD UNIQUE KEY `Mobile_Number_26` (`Mobile_Number`),
  ADD UNIQUE KEY `Email_27` (`Email`),
  ADD UNIQUE KEY `Mobile_Number_27` (`Mobile_Number`),
  ADD UNIQUE KEY `Email_28` (`Email`),
  ADD UNIQUE KEY `Mobile_Number_28` (`Mobile_Number`),
  ADD UNIQUE KEY `Email_29` (`Email`),
  ADD UNIQUE KEY `Email_30` (`Email`),
  ADD KEY `Email` (`Email`),
  ADD KEY `Mobile_Number` (`Mobile_Number`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `Admin_Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `applied_jobs`
--
ALTER TABLE `applied_jobs`
  MODIFY `job_applied_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `company_table`
--
ALTER TABLE `company_table`
  MODIFY `Company_Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `job_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `reported`
--
ALTER TABLE `reported`
  MODIFY `Report_Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `reporteds`
--
ALTER TABLE `reporteds`
  MODIFY `Report_Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `subscription`
--
ALTER TABLE `subscription`
  MODIFY `Sub_Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `suggestions_table`
--
ALTER TABLE `suggestions_table`
  MODIFY `Sug_Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user_table`
--
ALTER TABLE `user_table`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `applied_jobs`
--
ALTER TABLE `applied_jobs`
  ADD CONSTRAINT `applied_jobs_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`job_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `applied_jobs_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user_table` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
