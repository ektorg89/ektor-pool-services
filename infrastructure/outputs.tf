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

output "iam_role_name" {
  description = "IAM role name attached to the instance — used to grant additional policies"
  value       = aws_iam_role.pool_ec2_role.name
}

output "ssm_parameters_to_create" {
  description = "SSM Parameter Store paths that load-secrets.sh expects (create these before first deploy)"
  value = [
    "/ektor-pool-services/prod/DB_NAME",
    "/ektor-pool-services/prod/DB_USER",
    "/ektor-pool-services/prod/DB_PASSWORD",
    "/ektor-pool-services/prod/DB_ROOT_PASSWORD",
    "/ektor-pool-services/prod/SECRET_KEY",
    "/ektor-pool-services/prod/ANTHROPIC_API_KEY",
  ]
}
