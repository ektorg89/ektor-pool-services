variable "aws_region" {
  description = "AWS region where resources will be created"
  type        = string
  default     = "us-east-1"
}

variable "app_name" {
  description = "Application name used as prefix for all resource names"
  type        = string
  default     = "ektor-pool-services"
}

variable "ami_id" {
  description = "Amazon Machine Image ID for the EC2 instance (Amazon Linux 2023, us-east-1)"
  type        = string
  default     = "ami-0b6c6ebed2801a5cb"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "public_key_path" {
  description = "Path to the SSH public key to load into EC2 (e.g. ~/.ssh/id_rsa.pub)"
  type        = string
  default     = "~/.ssh/id_rsa.pub"
}
