# Project Definition

## Project Name

Fruit Store Management System

## Project Purpose

The Fruit Store Management System is a business operations platform for managing fruit store activity in one place. It combines inventory tracking, purchasing, supplier management, orders, sales monitoring, reports, settings, and administrator authentication.

## Business Goal

The main business goal is to help store operators run daily work with less manual effort and better visibility. The system should reduce stock mistakes, improve purchasing decisions, speed up order handling, and give management a clear view of business performance.

## Current Status

The project is already in an active working state.

- A Next.js frontend exists under `frontend/`.
- An Express and MongoDB backend exists under `backend/`.
- Authentication is implemented for protected admin routes.
- Core store modules are present in both the frontend navigation and backend API.
- MongoDB seed logic exists for default admin data and starter content.

The current system is functional, but it is still closer to a solid internal management platform than a fully hardened enterprise product.

## Main Users

- Store administrators
- Inventory managers
- Purchasing staff
- Sales and operations staff
- Business owners or supervisors reviewing reports

## Core Modules

- Dashboard
- Inventory
- Purchases
- Suppliers
- Orders
- Sales
- Reports
- Settings
- Authentication

## What the System Already Does

- Authenticates administrators before protected actions
- Stores business data in MongoDB
- Manages inventory records
- Manages supplier records
- Records purchases
- Records sales
- Tracks orders
- Provides dashboard and reporting views
- Supports settings and editable frontend content
- Supports profile image management for authenticated users

## What the System Should Become

The system should become a reliable business platform for multi-role retail operations. It should support cleaner workflows, stronger data validation, better reporting, improved security, more maintainable UI patterns, stronger testing coverage, and smoother deployment.

## Enterprise Improvement Direction

- Strengthen data consistency across inventory, purchases, sales, and orders
- Introduce clearer role and permission boundaries
- Improve auditability for business-critical actions
- Expand reporting into decision-ready analytics
- Improve testing, release confidence, and deployment readiness
- Standardize frontend component patterns for faster future delivery
- Prepare the platform for larger data volumes and more users
