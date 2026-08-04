pipeline {
    agent any

    environment {
        // Docker Repository & Image names
        FRONTEND_IMAGE           = 'adityakarmakar/event-portal-frontend'
        BACKEND_IMAGE            = 'adityakarmakar/event-portal-backend'
        DOCKERHUB_CREDENTIALS_ID = 'dockerhub-credentials'
        
        // Kubernetes Configuration
        K8S_NAMESPACE            = 'event-portal'
    }

    stages {
        // Stage 1: Source Code Checkout
        stage('Checkout Code') {
            steps {
                echo 'Checking out source code from Git repository...'
                checkout scm
            }
        }

        // Stage 2: Build Docker Images for Frontend and Backend
        stage('Build Docker Images') {
            steps {
                echo "Building Backend Docker Image version ${BUILD_NUMBER}..."
                sh "docker build -t ${BACKEND_IMAGE}:${BUILD_NUMBER} -t ${BACKEND_IMAGE}:latest ./backend"

                echo "Building Frontend Docker Image version ${BUILD_NUMBER}..."
                sh "docker build -t ${FRONTEND_IMAGE}:${BUILD_NUMBER} -t ${FRONTEND_IMAGE}:latest ./frontend"
            }
        }

        // Stage 3: Authenticate & Push Images to Docker Hub
        stage('Push Images to Docker Hub') {
            steps {
                echo 'Logging into Docker Hub and pushing images...'
                withCredentials([usernamePassword(credentialsId: "${DOCKERHUB_CREDENTIALS_ID}", passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                    sh 'echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin'
                    
                    echo "Pushing Backend Image tags (${BUILD_NUMBER}, latest)..."
                    sh "docker push ${BACKEND_IMAGE}:${BUILD_NUMBER}"
                    sh "docker push ${BACKEND_IMAGE}:latest"

                    echo "Pushing Frontend Image tags (${BUILD_NUMBER}, latest)..."
                    sh "docker push ${FRONTEND_IMAGE}:${BUILD_NUMBER}"
                    sh "docker push ${FRONTEND_IMAGE}:latest"
                }
            }
        }

        // Stage 4: Deploy Updated Container Images to Kubernetes
        stage('Deploy to Kubernetes') {
            steps {
                echo 'Updating Kubernetes deployments with newly built images...'
                sh "kubectl set image deployment/backend backend=${BACKEND_IMAGE}:${BUILD_NUMBER} -n ${K8S_NAMESPACE}"
                sh "kubectl set image deployment/frontend frontend=${FRONTEND_IMAGE}:${BUILD_NUMBER} -n ${K8S_NAMESPACE}"
            }
        }

        // Stage 5: Verify Deployment Rollout Status
        stage('Verify Rollout Status') {
            steps {
                echo 'Verifying rollout status for Backend deployment...'
                sh "kubectl rollout status deployment/backend -n ${K8S_NAMESPACE} --timeout=120s"

                echo 'Verifying rollout status for Frontend deployment...'
                sh "kubectl rollout status deployment/frontend -n ${K8S_NAMESPACE} --timeout=120s"
            }
        }
    }

    post {
        always {
            echo 'Cleaning up local Docker build images...'
            sh "docker rmi ${BACKEND_IMAGE}:${BUILD_NUMBER} ${BACKEND_IMAGE}:latest ${FRONTEND_IMAGE}:${BUILD_NUMBER} ${FRONTEND_IMAGE}:latest || true"
        }
        success {
            echo "Pipeline completed successfully! Event Portal build #${BUILD_NUMBER} deployed to '${K8S_NAMESPACE}' namespace."
        }
        failure {
            echo "Pipeline failed on build #${BUILD_NUMBER}. Please check stage logs for details."
        }
    }
}
