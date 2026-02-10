pipeline {
    agent any

    environment {
        DEFAULT_RECIPIENTS = 'tranglo.tbqa@gmail.com'
        DEFAULT_REPLYTO = ''
    }

    triggers {
        cron('0 22 * * 1-5')
    }

    parameters {
        choice(
            name: 'SPEC_FILE',
            choices: [
                'all',
                'tests/login/api.spec.ts',
            ],
            description: 'Select test spec file to run'
        )
    }

    stages {
        stage('Install Dependencies') {
            steps {
                echo "Installing Node.js dependencies..."
                script {
                    if (isUnix()) {
                        sh '''
                            npm ci || npm install
                            echo "Dependencies installed"
                        '''
                    } else {
                        bat '''
                            npm ci
                            if errorlevel 1 (
                                npm install
                            )
                            echo Dependencies installed
                        '''
                    }
                }
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                echo "Installing Playwright browsers..."
                script {
                    if (isUnix()) {
                        sh '''
                            npx playwright install
                            npx playwright install-deps || echo "Could not install system deps"
                            echo "Browsers installed"
                        '''
                    } else {
                        bat '''
                            npx playwright install
                            echo Browsers installed
                        '''
                    }
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    echo "Running Playwright tests..."
                    echo "Spec: ${params.SPEC_FILE}"

                    def testCommand = "npx playwright test tests/api.spec.ts"

                    if (params.SPEC_FILE != 'all') {
                        testCommand += " ${params.SPEC_FILE}"
                    }

                    if (isUnix()) {
                        sh """
                            export DOTENV_CONFIG_QUIET=true
                            export PWDEBUG=0
                            export CI=true
                            ${testCommand}
                        """
                    } else {
                        bat """
                            set DOTENV_CONFIG_QUIET=true
                            set PWDEBUG=0
                            set CI=true
                            ${testCommand}
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                echo "Archiving test results..."

                try {
                    // Archive test results and reports
                    if (fileExists('latest-report') || fileExists('playwright-report') || fileExists('test-results')) {
                        archiveArtifacts artifacts: 'playwright-report/**/*', allowEmptyArchive: true
                        archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true

                        // Publish HTML report if available
                        if (fileExists('playwright-report/index.html')) {
                            publishHTML([
                                allowMissing: false,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'playwright-report',
                                reportFiles: 'index.html',
                                reportName: "Playwright Report"
                            ])
                        }

                        echo "Test results archived"
                    } else {
                        echo "No test artifacts found"
                    }

                    // Only send email for non-aborted builds
                    if (currentBuild.result != 'ABORTED') {
                        sendEmailNotification()
                    }

                } catch (Exception e) {
                    echo "Error archiving artifacts: ${e.getMessage()}"
                }
            }
        }

        success {
            script {
                echo "Pipeline completed successfully"
            }
        }

        failure {
            script {
                echo "Pipeline failed"
            }
        }

        aborted {
            script {
                echo "Pipeline was aborted (likely due to branch indexing)"
            }
        }

        cleanup {
            script {
                try {
                    // Security: Always remove .env file after build
                    if (fileExists('.env')) {
                        if (isUnix()) {
                            sh 'rm -f .env'
                        } else {
                            bat 'del /f .env 2>nul || echo .env file not found'
                        }
                        echo "Environment file cleaned up"
                    }
                } catch (Exception e) {
                    echo "Could not clean up .env file: ${e.getMessage()}"
                }
            }
        }
    }
}

// Function to send email notification
def sendEmailNotification() {
    try {
        def recipients = env.DEFAULT_RECIPIENTS
        def replyTo = env.DEFAULT_REPLYTO

        echo "Sending email notification to: ${recipients}"

        def emailSubject = "Jenkins Automation Test - ${env.JOB_NAME}"

        // Create email body with HTML content
        def emailBody = """
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
            </style>
        </head>
        <body>
            <p style="margin-top: 20px;">
                <strong>Note:</strong> Kindly download the attached files to view the full test report and logs. Thank you.
            </p>
        </body>
        </html>
        """

        // Send email using EmailExt with only specific files attached
        emailext(
            subject: emailSubject,
            body: emailBody,
            mimeType: 'text/html',
            to: recipients,
            replyTo: replyTo,
            attachmentsPattern: 'playwright-report/index.html',
            compressLog: true
        )

        echo "Email notification sent successfully"

    } catch (Exception e) {
        echo "Failed to send email notification: ${e.getMessage()}"
    }
}
