pipeline {
    options {
        buildDiscarder(logRotator(numToKeepStr: '20'))
        disableConcurrentBuilds()
    }

    parameters {
        string(name: "BRANCH", description: "Branch to build from", defaultValue: "main")
        string(name: "BASE_URL", description: "Override default base URL", defaultValue: "http://stackadapt-interview.us-east-1.elasticbeanstalk.com/")
        string(name: "INFLUX_URL", description: "Specify URL to InfluxDB", defaultValue: "https://us-east-1-1.aws.cloud2.influxdata.com")
        string(name: "INFLUX_BUCKET", description: "Specify InfluxDB bucket", defaultValue: "stacktodo")
        string(name: "INFLUX_ORG", description: "Specify InfluxDB org", defaultValue: "selenium")
    }

    environment {
        INFLUX_TOKEN = credentials('INFLUX_TOKEN')
        USER_CREDENTIALS = credentials('STACK_TODO_TEST_USER')
    }

    agent any

    stages{

        stage('Checkout') {
            steps {
                script {
                    echo "Checking out the project"
                }
                checkout([$class: 'GitSCM', branches: [[name: "${params.BRANCH}"]], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[url: 'https://github.com/shenderov/stack-todo.git']]])
            }
        }

       stage ('NPM Install') {
                steps {
                    script {
                        echo "Install NPM Dependencies..."
                        sh 'npm i'
                }
            }
        }

        stage ('Test') {
            steps {
                script {
                    echo "Start test running and sending data to InfluxDB..."
                    sh 'npx playwright test'
            }
        }
    }
}
}
