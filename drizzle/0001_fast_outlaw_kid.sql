CREATE TABLE `accounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('bank_account','savings','credit_card','digital_wallet','investment','other') NOT NULL,
	`balance` int NOT NULL DEFAULT 0,
	`currency` varchar(3) NOT NULL DEFAULT 'BRL',
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `accounts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `budgets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`category` enum('food','transportation','health','education','entertainment','subscriptions','utilities','insurance','salary','investment','other') NOT NULL,
	`limit` int NOT NULL,
	`spent` int NOT NULL DEFAULT 0,
	`month` varchar(7) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `budgets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `recurringTransactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`accountId` int NOT NULL,
	`amount` int NOT NULL,
	`type` enum('income','expense') NOT NULL,
	`category` enum('food','transportation','health','education','entertainment','subscriptions','utilities','insurance','salary','investment','other') NOT NULL,
	`description` varchar(500),
	`frequency` enum('daily','weekly','biweekly','monthly','quarterly','yearly') NOT NULL,
	`nextOccurrenceDate` timestamp NOT NULL,
	`status` enum('active','paused','completed') NOT NULL DEFAULT 'active',
	`endDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `recurringTransactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `savingsGoals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`targetAmount` int NOT NULL,
	`currentAmount` int NOT NULL DEFAULT 0,
	`targetDate` timestamp NOT NULL,
	`description` text,
	`status` enum('active','completed','abandoned') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `savingsGoals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`accountId` int NOT NULL,
	`amount` int NOT NULL,
	`type` enum('income','expense') NOT NULL,
	`category` enum('food','transportation','health','education','entertainment','subscriptions','utilities','insurance','salary','investment','other') NOT NULL,
	`description` varchar(500),
	`transactionDate` timestamp NOT NULL,
	`isRecurring` boolean NOT NULL DEFAULT false,
	`recurringId` int,
	`categorizedAutomatically` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `mfaEnabled` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `mfaSecret` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `sharedWithIds` text;