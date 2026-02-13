import subprocess
import sys

def install_dependencies():
    print("📦 Installing required packages...")
    
    packages = ['flask', 'flask-cors']
    
    for package in packages:
        print(f"Installing {package}...")
        try:
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', package])
            print(f"✅ {package} installed successfully")
        except subprocess.CalledProcessError:
            print(f"❌ Failed to install {package}")
            print(f"Try: pip install {package}")
    
    print("\n✅ All packages installed!")
    print("👉 Now run: python database.py")

if __name__ == "__main__":
    install_dependencies()