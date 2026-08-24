terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# ── Security Group ────────────────────────────────────────────
resource "aws_security_group" "pool_api" {
  name        = "${var.app_name}-sg"
  description = "Allow SSH, HTTP, HTTPS, and FastAPI traffic"

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "FastAPI"
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name    = "${var.app_name}-sg"
    Project = var.app_name
  }
}

# ── Key Pair ──────────────────────────────────────────────────
resource "aws_key_pair" "pool_key" {
  key_name   = "${var.app_name}-key"
  public_key = file(var.public_key_path)

  tags = {
    Project = var.app_name
  }
}

# ── EC2 Instance ──────────────────────────────────────────────
resource "aws_instance" "pool_server" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  key_name               = aws_key_pair.pool_key.key_name
  vpc_security_group_ids = [aws_security_group.pool_api.id]

  tags = {
    Name    = "${var.app_name}-server"
    Project = var.app_name
  }
}
