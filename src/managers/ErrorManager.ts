import { shopsyBridge, ShopsyMessageAction, ShopsyMessageType } from '../shopsystan/shopsyBridge';

// Error types enum
export enum ErrorType {
    CONNECTIVITY = 'connectivity',
    CRITICAL_SAVE = 'critical_save',
    FATAL = 'fatal',
    WEBGL_CRASH = 'webgl_crash',
    OOM = 'oom',
    CUSTOM = 'custom',
}

interface ErrorConfig {
    title?: string;
    subtitle: string;
    iconVariant: number; // 1-4 (maps to Error_icon1-4)
    errorboxVariant: number; // 1-2 (maps to Error_box1-2)
    buttonVariant: number; // 1-4 (maps to button_text_1-4)
    buttonType: number; // 1-2 (maps to button_type_1 or button_type_2)
    buttonText: string;
    action: 'retry' | 'reload' | 'close' | 'exit';
}

interface errorData {
    title?: string;
    subtitle?: string;
    errorMessage?: string;
    success?: boolean;
    buttonText?: string;
    action?: 'retry' | 'reload' | 'close' | 'exit';
}

// Error configurations for each error type
const ERROR_CONFIGS: Record<ErrorType, ErrorConfig> =
{
    [ErrorType.CONNECTIVITY]: {
        title: 'NO Internet',
        subtitle: 'Please connect to the\n   internet and retry',
        iconVariant: 1,
        errorboxVariant: 1,
        buttonVariant: 1,
        buttonType: 1,
        buttonText: 'Retry',
        action: 'reload'
    },
    [ErrorType.CRITICAL_SAVE]: {
        title: 'Adding Rewards!',
        subtitle: 'Your rewards will be added\n to your account shortly',
        iconVariant: 2,
        errorboxVariant: 2,
        buttonVariant: 2,
        buttonType: 1,
        buttonText: 'Okay',
        action: 'retry'
    },
    [ErrorType.FATAL]: {
        title: 'Something Went wrong',
        subtitle: 'We are working on this,\n please try again ',
        iconVariant: 3,
        errorboxVariant: 2,
        buttonVariant: 3,
        buttonType: 1,
        buttonText: 'Try Again',
        action: 'reload'
    },
    [ErrorType.WEBGL_CRASH]: {
        title: 'Device unsupported',
        subtitle: 'Your device does not\n support the graphics',
        iconVariant: 4,
        errorboxVariant: 2,
        buttonVariant: 4,
        buttonType: 2,
        buttonText: 'Close',
        action: 'exit'
    },
    [ErrorType.OOM]: {
        title: 'Memory Full',
        subtitle: 'Not enough memory available. \nPlease close other apps and \ntry again.',
        iconVariant: 4,
        errorboxVariant: 2,
        buttonVariant: 4,
        buttonType: 1,
        buttonText: 'Reload',
        action: 'reload'
    },
    [ErrorType.CUSTOM]: {
        title: 'Memory Full',
        subtitle: 'Not enough memory available.\n Please close other apps and\n try again.',
        iconVariant: 4,
        errorboxVariant: 2,
        buttonVariant: 4,
        buttonType: 1,
        buttonText: 'Reload',
        action: 'reload'
    }

};

export class ErrorPopupManager {
    private scene: Phaser.Scene;
    private errorContainer: Phaser.GameObjects.Container | null = null;
    private currentErrorType: ErrorType | null = null;
    private initialized = false;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    /**
     * Initialize and setup bridge listeners
     */
    public init() {
        if (this.initialized) return;
        this.initialized = true;

        // Get reference to error_panel_container
        this.errorContainer = this.scene.children.getByName('error_panel_container') as Phaser.GameObjects.Container;

        if (!this.errorContainer) {
            console.error('[ErrorPopupManager] error_panel_container not found in scene');
            return;
        }

        // Hide container by default
        this.errorContainer.setVisible(false);

        // Setup bridge listeners
        this.setupBridgeListeners();
    }

    /**
     * Setup bridge listeners for various error messages
     */
    private setupBridgeListeners() {
        // Network interruption errors
        shopsyBridge.on(ShopsyMessageAction.NETWORK_INTERRUPTED, (data: errorData) => {
            console.log('[ErrorPopupManager] Network interrupted');
            this.showError(ErrorType.CONNECTIVITY, data);
        });

        shopsyBridge.on(ShopsyMessageAction.NETWORK_LOAD_ERROR, (data: errorData) => {
            console.log('[ErrorPopupManager] Network load error');
            this.showError(ErrorType.CONNECTIVITY, data);

        });

        // Load failure errors
        shopsyBridge.on(ShopsyMessageAction.HUB_LOAD_ERROR, (data: errorData) => {
            console.log('[ErrorPopupManager] Hub load error:', data);
            this.showError(ErrorType.FATAL, data);
        });

        shopsyBridge.on(ShopsyMessageAction.GAME_LOAD_ERROR, (data: errorData) => {
            console.log('[ErrorPopupManager] Game load error:', data);
            this.showError(ErrorType.FATAL, data);
        });

        // JS errors
        shopsyBridge.on(ShopsyMessageAction.JS_ERROR, (data: errorData) => {
            console.log('[ErrorPopupManager] Fatal JS error:', data);
            this.showError(ErrorType.FATAL, data);
        });

        // Fatal JS errors
        shopsyBridge.on(ShopsyMessageAction.FATAL_JS_ERROR, (data: errorData) => {
            console.log('[ErrorPopupManager] Fatal JS error:', data);
            this.showError(ErrorType.FATAL, data);
        });

        // WebView/Activity termination (OOM)
        shopsyBridge.on(ShopsyMessageAction.WEBVIEW_TERMINATED, (data: errorData) => {
            console.log('[ErrorPopupManager] WebView terminated');
            this.showError(ErrorType.OOM, data);
        });

        shopsyBridge.on(ShopsyMessageAction.OOM_WEBVIEW_TERMINATED, (data: errorData) => {
            console.log('[ErrorPopupManager] OOM WebView terminated');
            this.showError(ErrorType.OOM, data);
        });

        // Low memory warning
        shopsyBridge.on(ShopsyMessageAction.LOW_MEMORY_WARNING, (data: errorData) => {
            console.log('[ErrorPopupManager] Low memory warning');
            this.showError(ErrorType.OOM, data);
        });

        // Critical failure
        shopsyBridge.on(ShopsyMessageAction.CRITICAL_FAILURE, (data: errorData) => {
            console.log('[ErrorPopupManager] Critical failure:', data);
            const errorType = this.determineErrorType(data);
            this.showError(errorType, data);
        });

        // Recovery outcomes
        shopsyBridge.on(ShopsyMessageAction.RECOVERY_OUTCOME, (data: errorData) => {
            if (data?.success === false) {
                console.log('[ErrorPopupManager] Recovery failed');
                this.showError(ErrorType.FATAL, data);
            }
        });

        // Network restored - hide connectivity error if showing
        shopsyBridge.on(ShopsyMessageAction.NETWORK_RESTORED, () => {
            console.log('[ErrorPopupManager] Network restored');
            if (this.currentErrorType === ErrorType.CONNECTIVITY) {
                this.hideErrorPopup();
            }
        });
    }


    // * Determine error type from error data context

    private determineErrorType(data: any): ErrorType {
        const context = data || {};

        // Check for WebGL/graphics errors
        if (context.errorMessage?.includes('WebGL') ||
            context.errorMessage?.includes('graphics') ||
            context.type === 'webgl') {
            return ErrorType.WEBGL_CRASH;
        }

        // Check for network errors
        if (context.type === 'network' ||
            context.errorMessage?.includes('network') ||
            context.errorMessage?.includes('connection')) {
            return ErrorType.CONNECTIVITY;
        }

        // Check for save errors
        console.log("checking errors", context.errorMessage);
        if (context.type === 'save' ||
            context.operation === 'save' ||
            context.errorMessage?.includes('save')) {
            return ErrorType.CRITICAL_SAVE;
        }

        // Check for OOM errors
        if (context.type === 'oom' ||
            context.errorMessage?.includes('memory') ||
            context.errorMessage?.includes('OutOfMemory')) {
            return ErrorType.OOM;
        }

        return ErrorType.FATAL;
    }

    /**
     * Show error popup with specified error type
     */
    public showError(errorType: ErrorType, data?: any) {
        if (!this.errorContainer) {
            console.error('[ErrorPopupManager] Error_container not found');
            return;
        }

        const config = ERROR_CONFIGS[errorType];
        this.currentErrorType = errorType;

        console.log('[ErrorPopupManager] Showing error:', errorType, config);

        // Hide all variants first
        this.hideAllErrorVariants();

        // Show the appropriate variant
        this.showErrorVariant(config, data);

        // Setup button interaction
        this.setupButton(config);

        // Make container visible
        this.errorContainer.setVisible(true);

        // Bring to front
        this.scene.children.bringToTop(this.errorContainer);

        // Send analytics event
        shopsyBridge.analyticsEvent('error_displayed', {
            errorType: errorType,
            errorTitle: config.title
        });
    }

    /**
     * Hide all error UI variants
     */
    private hideAllErrorVariants() {
        if (!this.errorContainer) return;

        // Hide all error boxes (Error_box1, Error_box2)
        for (let i = 1; i <= 2; i++) {
            const box = this.errorContainer.getByName(`Error_box${i}`);
            if (box && 'setVisible' in box) {
                (box as any).setVisible(false);
            }
        }

        // Hide all titles (Error_title1, Error_title2, Error_title3, Error_title4)
        for (let i = 1; i <= 4; i++) {
            const title = this.errorContainer.getByName(`Error_title${i}`);
            if (title && 'setVisible' in title) {
                (title as any).setVisible(false);
            }
        }

        // Hide all subtitles (error_subtitle1, error_subtitle2, error_subtitle3, error_subtitle4)
        for (let i = 1; i <= 4; i++) {
            const subtitle = this.errorContainer.getByName(`error_subtitle${i}`);
            if (subtitle && 'setVisible' in subtitle) {
                (subtitle as any).setVisible(false);
            }
        }

        // Hide all icons (Error_icon1, Error_icon2, Error_icon3, Error_icon4)
        for (let i = 1; i <= 4; i++) {
            const icon = this.errorContainer.getByName(`Error_icon${i}`);
            if (icon && 'setVisible' in icon) {
                (icon as any).setVisible(false);
            }
        }

        // Hide all button types (button_type_1, button_type_2)
        for (let i = 1; i <= 2; i++) {
            const button = this.errorContainer.getByName(`button_type_${i}`);
            if (button && 'setVisible' in button) {
                (button as any).setVisible(false);
                // Remove any existing listeners
                if ('removeAllListeners' in button) {
                    (button as any).removeAllListeners();
                }
            }
        }

        // Hide all button texts (button_text_1, button_text_2, button_text_3, button_text_4)
        for (let i = 1; i <= 4; i++) {
            const buttonText = this.errorContainer.getByName(`button_text_${i}`);
            if (buttonText && 'setVisible' in buttonText) {
                (buttonText as any).setVisible(false);
            }
        }
    }

    /**
     * Show specific error variant based on config
     */
    private showErrorVariant(config: ErrorConfig, data?: any) {
        if (!this.errorContainer) return;

        const { iconVariant, buttonVariant, buttonType, errorboxVariant } = config;

        // Show ONLY the correct error box
        for (let i = 1; i <= 2; i++) {
            const box = this.errorContainer.getByName(
                `Error_box${i}`
            );

            if (box && 'setVisible' in box) {
                (box as any).setVisible(i === errorboxVariant);
            }
        }


        // Show title
        const title = this.errorContainer.getByName(`Error_title${iconVariant}`) as Phaser.GameObjects.Text;
        if (title && 'setVisible' in title) {
            title.setVisible(true);
            if ('setText' in title) {
                const titleText = data?.title ? data?.title : config.title;
                title.setText(titleText);

            }
        }


        // Show ONLY the correct subtitle
        for (let i = 1; i <= 4; i++) {
            const subtitle = this.errorContainer.getByName(
                `error_subtitle${i}`
            ) as Phaser.GameObjects.Text;

            if (subtitle && 'setVisible' in subtitle) {
                const shouldShow = i === iconVariant;
                subtitle.setVisible(shouldShow);

                if (
                    shouldShow &&
                    'setText' in subtitle
                ) {
                    const subtitleText =
                        data?.subtitle
                            ? data.subtitle
                            : (config.subtitle && config.subtitle.trim().length > 0
                                ? config.subtitle
                                : null);

                    if (subtitleText !== null) {
                        subtitle.setText(subtitleText);
                    }
                }
            }
        }



        // Show icon
        const icon = this.errorContainer.getByName(`Error_icon${iconVariant}`);
        if (icon && 'setVisible' in icon) {
            (icon as any).setVisible(true);
        }

        for (let i = 1; i <= 2; i++) {
            const btn = this.errorContainer.getByName(
                `button_type_${i}`
            ) as Phaser.GameObjects.Image;

            if (btn instanceof Phaser.GameObjects.Image) {
                btn.setVisible(i === buttonType);
            }
        }


        // Show and set button text
        const buttonText = this.errorContainer.getByName(`button_text_${buttonVariant}`) as Phaser.GameObjects.Text;
        if (buttonText && 'setVisible' in buttonText) {
            buttonText.setVisible(true);
            if ('setText' in buttonText) {
                const finalText = data?.buttonText ? data?.buttonText : config.buttonText;
                buttonText.setText(finalText);
            }
        }
    }

    /**
     * Setup button interaction based on config action
     */
    private setupButton(config: ErrorConfig) {
        if (!this.errorContainer) return;

        //  First: disable input on BOTH buttons
        for (let i = 1; i <= 2; i++) {
            const btn = this.errorContainer.getByName(
                `button_type_${i}`
            ) as Phaser.GameObjects.Image;

            if (btn instanceof Phaser.GameObjects.Image) {
                btn.disableInteractive();
            }
        }

        // Get the correct button
        const button = this.errorContainer.getByName(
            `button_type_${config.buttonType}`
        ) as Phaser.GameObjects.Image;

        if (!(button instanceof Phaser.GameObjects.Image)) {
            console.warn('[ErrorPopupManager] Button not found');
            return;
        }

        // Ensure ONLY this button is visible
        button.setVisible(true);

        // Proper interactive hit area
        button.setInteractive(
            new Phaser.Geom.Rectangle(
                0,
                0,
                button.displayWidth,
                button.displayHeight
            ),
            Phaser.Geom.Rectangle.Contains
        );

        // Remove old listeners (safety)
        button.removeAllListeners();

        // Click
        button.on('pointerdown', () => {
            console.log('[ErrorPopupManager] Button clicked:', config.action);
            this.handleButtonAction(config.action);
        });

        // Hover FX
        button.on('pointerover', () => button.setScale(1.05));
        button.on('pointerout', () => button.setScale(1.0));
    }


    /**
     * Handle button action based on error type
     */
    private handleButtonAction(action: 'retry' | 'reload' | 'close' | 'exit') {
        console.log('[ErrorPopupManager] Handling action:', action);

        // Send analytics event
        shopsyBridge.analyticsEvent('error_action_taken', {
            errorType: this.currentErrorType,
            action: action
        });

        switch (action) {
            case 'retry':
                this.handleRetry();
                break;

            case 'reload':
                this.handleReload();
                break;

            case 'close':
            case 'exit':
                this.handleExit();
                break;
        }
    }

    /**
     * Handle retry action (for connectivity/save errors)
     */
    private handleRetry() {
        console.log('[ErrorPopupManager] Retry action triggered');

        this.hideErrorPopup();

        if (this.currentErrorType === ErrorType.CONNECTIVITY) {
            // Attempt to retry network operation
            shopsyBridge.send(
                ShopsyMessageType.NETWORK_INTERRUPTION,
                ShopsyMessageAction.RETRY_AFTER_NETWORK
            );
        } else if (this.currentErrorType === ErrorType.CRITICAL_SAVE) {
            // Attempt to retry save operation
            shopsyBridge.send(
                ShopsyMessageType.LOAD_FAILURE,
                ShopsyMessageAction.RETRY_LOAD
            );
        }
    }

    /**
     * Handle reload action (for fatal/OOM errors)
     */
    private handleReload() {
        console.log('[ErrorPopupManager] Reload action triggered');

        if (this.currentErrorType === ErrorType.OOM) {
            // Notify native of recovery attempt
            shopsyBridge.send(
                ShopsyMessageType.OUT_OF_MEMORY,
                ShopsyMessageAction.RECOVER_AFTER_OOM
            );
        } else {
            // For other fatal errors, request webview reload
            shopsyBridge.send(
                ShopsyMessageType.ACTIVITY_RECREATION,
                ShopsyMessageAction.RELOAD_WEBVIEW
            );
        }

        // Reload the page after a short delay
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }

    /**
     * Handle exit action (for unrecoverable errors)
     */
    private handleExit() {
        console.log('[ErrorPopupManager] Exit action triggered');

        this.hideErrorPopup();

        // Close the SDK/game
        shopsyBridge.closeSdk();
    }

    /**
     * Hide the error popup
     */
    public hideErrorPopup() {
        if (this.errorContainer && 'setVisible' in this.errorContainer) {
            this.errorContainer.setVisible(false);
        }
        this.currentErrorType = null;
    }

    /**
     * Manual trigger methods for testing
     */
    public triggerConnectivityError() {
        this.showError(ErrorType.CONNECTIVITY);
    }

    public triggerCriticalSaveError() {
        this.showError(ErrorType.CRITICAL_SAVE);
    }

    public triggerFatalError() {
        this.showError(ErrorType.FATAL);
    }

    public triggerWebGLError() {
        this.showError(ErrorType.WEBGL_CRASH);
    }

    public triggerOOMError() {
        this.showError(ErrorType.OOM);
    }
}
