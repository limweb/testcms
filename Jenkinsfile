pipeline {
  agent any
  tools {nodejs "node"}
  stages {
    stage('Install dependencies') {
      steps {
        sh "curl -X POST -H 'Content-Type: application/json' -d '{ \"title\": \"Virtual event cms\", \"text\": \"build - #${env.BUILD_NUMBER} : Start\"}\' https://open.larksuite.com/open-apis/bot/hook/03b32d6da35e4ce6a2a43100bf57e678"
        sh 'cp ./deploy/dev/Dockerfile ./Dockerfile'
        sh 'cp ./deploy/dev/docker-compose.yml ./docker-compose.yml'
        sh 'cp ./.env.dev ./.env'
        sh 'ls -la'
        sh 'npm install'
      }
    }
    stage('Build') {
      steps {
       sh 'npm run build'
      }
    }
    stage ('Deploy') {
      steps{
        // sh 'docker-compose down'
        // sh 'docker rmi virtual-event-cms:dev'
        sh 'docker build -t virtual-event-cms:dev . '
        sh 'docker-compose up -d '
        sh 'docker image prune --force'
      }
    }
  }
  post {
        always {
            echo 'I will do this no matter what the status is'
        }
        success {
            echo 'OK'
            sh "curl -X POST -H 'Content-Type: application/json' -d '{ \"title\": \"Virtual event cms\", \"text\": \"build - #${env.BUILD_NUMBER} : Success\"}\' https://open.larksuite.com/open-apis/bot/hook/03b32d6da35e4ce6a2a43100bf57e678"
        }
        failure {
            echo 'FAIL'
            sh "curl -X POST -H 'Content-Type: application/json' -d '{ \"title\": \"Virtual event cms\", \"text\": \"build - #${env.BUILD_NUMBER} : Fail\"}\' https://open.larksuite.com/open-apis/bot/hook/03b32d6da35e4ce6a2a43100bf57e678"
        }
    }
}