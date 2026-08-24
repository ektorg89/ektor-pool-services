output "instance_public_ip" {
  description = "Public IP of the EC2 instance — use this to SSH and configure DNS"
  value       = aws_instance.pool_server.public_ip
}

output "instance_public_dns" {
  description = "Public DNS hostname assigned by AWS"
  value       = aws_instance.pool_server.public_dns
}

output "security_group_id" {
  description = "ID of the security group attached to the instance"
  value       = aws_security_group.pool_api.id
}

output "ssh_command" {
  description = "Ready-to-run SSH command to connect to the instance"
  value       = "ssh -i ~/.ssh/id_rsa ec2-user@${aws_instance.pool_server.public_ip}"
}
