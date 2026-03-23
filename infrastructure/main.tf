terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_instance" "pool_server" {
  ami                    = "ami-0b6c6ebed2801a5cb"
  instance_type          = "t3.micro"
  key_name               = "ektor-pool-key"
  iam_instance_profile   = "ektor-pool-ec2-role"
  vpc_security_group_ids = ["sg-0232ef1477954d73a"]

  tags = {
    Name = "ektor-pool-api-server"
  }
}
