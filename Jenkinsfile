pipeline {
  // NOTE: keep this block on its own lines (avoid inline comments on the agent line)
  agent {
    docker {
      image 'node:18'
      args  '-u root:root' 
    }
  }

  options {
    // prevents automatic checkout at top level (we do explicit checkout stage)
    skipDefaultCheckout(true)
    // keep log size reasonable
    buildDiscarder(logRotator(numToKeepStr: '10'))
    // fail pipeline if any stage times out (adjust timeout as needed)
    timeout(time: 60, unit: 'MINUTES')
  }

  environment {
    NODE_ENV = 'test'
    DOCKERHUB_CREDS = credentials('dockerhub-creds') // optional: set in Jenkins credentials
  }

  stages {
    stage('Checkout') {
      steps {
        script {
          // explicit checkout (works for Multibranch Pipeline / PRs)
          checkout scm
          echo "Checked out commit: ${env.GIT_COMMIT ?: 'unknown'}"
        }
      }
    }

    stage('Install & Test') {
      steps {
        dir('backend') {
          // fail fast if install or tests fail
          sh 'npm ci --silent'
          sh 'npm test'
        }
      }
      post {
        failure {
          echo "Tests failed — please check test output and diagnostic logs."
        }
      }
    }

    stage('Build (optional Docker)') {
      when { expression { fileExists('Dockerfile') } }
      steps {
        script {
          // If you want to build images from inside this agent, Docker must be available in the agent.
          sh 'if docker --version >/dev/null 2>&1; then echo "docker present"; else echo "docker not present; skipping docker build"; fi'
          // Example build command (uncomment if you actually want to build):
          // sh "docker build -t my-app:${env.BUILD_ID} ."
        }
      }
    }
  }

  post {
    always {
      echo "Finished: ${currentBuild.fullDisplayName} -> ${currentBuild.currentResult}"
      archiveArtifacts artifacts: 'backend/**/*.log', allowEmptyArchive: true
      junit allowEmptyResults: true, testResults: 'backend/test-results/**/*.xml'
      // Optionally clean workspace:
      // cleanWs()
    }
  }
}
