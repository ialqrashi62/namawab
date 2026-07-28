import os
import subprocess
import time

local_workspace = r"c:\Users\ice\Desktop\NMEDCALVSCODE"
local_tar = os.path.join(local_workspace, "local_deploy.tar.gz")
ssh_key = r"C:\Users\ice\.ssh\nama_medical_key"
remote_host = "root@204.168.144.74"

missing_migrations = []

def run_local(cmd):
    print(f"Executing local: {cmd}")
    subprocess.check_call(cmd, shell=True)

def run_remote(cmd):
    print(f"Executing remote: {cmd}")
    ssh_cmd = f'ssh -i {ssh_key} -o StrictHostKeyChecking=no {remote_host} "{cmd}"'
    subprocess.check_call(ssh_cmd, shell=True)

try:
    # 1. Create local tarball (excluding node_modules and .git)
    print("Packing codebase...")
    if os.path.exists(local_tar):
        os.remove(local_tar)
    run_local(f'tar.exe --exclude="namaweb/node_modules" --exclude="namaweb/.git" -czf "{local_tar}" -C "{local_workspace}" namaweb')
    
    # 2. Upload tarball
    print("Uploading to server...")
    run_local(f'scp -i {ssh_key} -o StrictHostKeyChecking=no "{local_tar}" {remote_host}:/tmp/local_deploy.tar.gz')
    
    # 3. Extract codebase on server
    print("Extracting on server...")
    run_remote('tar -xzf /tmp/local_deploy.tar.gz -C /var/www/')
    
    # 4. Install production dependencies
    print("Installing production dependencies...")
    run_remote('cd /var/www/namaweb && npm install')
    
    # 5. Execute missing migrations sequentially
    print("Executing missing migrations...")
    for mig in missing_migrations:
        print(f"Applying migration: {mig}")
        run_remote(f'sudo -u postgres psql -d nama_medical_web -f /var/www/namaweb/migrations/{mig}')
        
    # 6. Restart application under PM2
    print("Restarting nama-medical-erp under PM2...")
    run_remote('pm2 restart nama-medical-erp')
    run_remote('pm2 save')
    
    # 7. Check health
    print("Performing health check...")
    time.sleep(3)
    run_remote('curl -s http://localhost:3000/api/health')
    
    print("\nDeployment completed successfully!")

finally:
    # Cleanup local tarball
    if os.path.exists(local_tar):
        os.remove(local_tar)
    # Cleanup remote tarball
    try:
        run_remote('rm -f /tmp/local_deploy.tar.gz')
    except Exception:
        pass
