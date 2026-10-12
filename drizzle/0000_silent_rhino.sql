CREATE TABLE `transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`player` text NOT NULL,
	`reason` text NOT NULL,
	`amount` integer NOT NULL,
	`imported_at` text NOT NULL,
	`imported_by` text NOT NULL
);
