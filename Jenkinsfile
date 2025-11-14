pipeline {
  agent { docker { image 'node:18' args '-u root:root' } } // runs steps inside node container

  environment {
    // optional: Docker Hub creds id (not used unless you enable push stage)
    DOCKERHUB_CREDS = credentials('dockerhub-creds') 
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
        echo "Checked out ${env.GIT_COMMIT}"
      }
    }

    stage('Install & Test') {
      steps {
        dir('backend') {
          sh 'npm ci'
          sh 'npm test'
        }
      }
      post {
        failure {
          echo "Tests failed — logs archived"
        }
      }
    }

    stage('Build (optional)') {
      when { expression { fileExists('Dockerfile') } }
      steps {
        script {
          // build image locally on agent (won't persist on Jenkins host)
          sh 'docker --version || echo "docker not present in agent; skipping docker build"'
          // If you mounted Docker socket into Jenkins container, you can enable docker build here.
        }
      }
    }
  }

  post {
    always {
      echo "Build finished: ${currentBuild.fullDisplayName} -> ${currentBuild.currentResult}"
      // Archive any backend logs (if present)
      archiveArtifacts artifacts: 'backend/**/*.log', allowEmptyArchive: true
      // If your tests produce JUnit XML (optional), Jenkins will publish them:
      junit allowEmptyResults: true, testResults: 'backend/test-results/**/*.xml'
    }
  }
}
