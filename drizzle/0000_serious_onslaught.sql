-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`discord_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`created_ip` text NOT NULL,
	`type` text DEFAULT 'user',
	`banned` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `requests` (
	`path` text PRIMARY KEY NOT NULL,
	`served` integer DEFAULT 1,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `images` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`verified` integer DEFAULT 0,
	`name` text,
	`uploaded_by` text,
	`created_at` integer NOT NULL,
	`uploaded_ip` text NOT NULL,
	FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `image_likes` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`created_ip` text NOT NULL,
	`image_id` text,
	FOREIGN KEY (`image_id`) REFERENCES `images`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `image_reports` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`created_ip` text NOT NULL,
	`image_id` text,
	`content` text NOT NULL,
	FOREIGN KEY (`image_id`) REFERENCES `images`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `discord_idx` ON `users` (`discord_id`);--> statement-breakpoint
CREATE INDEX `type_idx` ON `images` (`type`);--> statement-breakpoint
CREATE UNIQUE INDEX `image_likes_created_ip_image_id_unique` ON `image_likes` (`created_ip`,`image_id`);
*/