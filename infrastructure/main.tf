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

# ── IAM Role (allows EC2 to read SSM parameters) ─────────────
resource "aws_iam_role" "pool_ec2_role" {
  name = "${var.app_name}-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })

  tags = {
    Project = var.app_name
  }
}

resource "aws_iam_role_policy_attachment" "ssm_read" {
  role       = aws_iam_role.pool_ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMReadOnlyAccess"
}

resource "aws_iam_instance_profile" "pool_ec2_profile" {
  name = "${var.app_name}-ec2-profile"
  role = aws_iam_role.pool_ec2_role.name
}

# ── EC2 Instance ──────────────────────────────────────────────
resource "aws_instance" "pool_server" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  key_name               = aws_key_pair.pool_key.key_name
  vpc_security_group_ids = [aws_security_group.pool_api.id]
  iam_instance_profile   = aws_iam_instance_profile.pool_ec2_profile.name

  tags = {
    Name    = "${var.app_name}-server"
    Project = var.app_name
  }
}
