pipeline {
    agent any

    stages {

        stage('Checkout Code') {
            steps {
                echo "Pulling code from GitHub..."
                git branch: 'main',
                    url: 'https://github.com/soumitha3/crud_app.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "Installing Node dependencies..."
                sh 'cd backend && npm install'
            }
        }

        // stage('Run Tests') {
        //     steps {
        //         echo "Running automated tests..."
        //         sh 'cd backend && npm test'
        //     }
        // }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image..."
                sh 'docker build -t crud-app .'
            }
        }

        stage('Run Docker Container') {
            steps {
                echo "Running Docker container..."
                sh 'docker run -d -p 3005:3000 --name crud-container2 crud-app'
            }
        }
    }

    post {
        success {
            echo "Build SUCCESS!"
        }
        failure {
            echo "Build FAILED!"
        }
    }
}