export const translations = {
    en: {
        settings: {
            title: 'Settings',
            tabs: {
                app: 'App',
                appearance: 'Appearance',
                terminal: 'Terminal',
                ai: 'AI Assistant'
            },
            appearance: {
                title: 'Appearance',
                theme: 'Theme',
                themeDesc: 'Select a theme to customize the look and feel of the application.',
                language: 'Language',
                languageDesc: 'Select your preferred language.',
                font: 'UI Font',
                fontDesc: 'Choose the font for the user interface.',
                opacity: 'Window Opacity',
                backgroundTheme: 'Background Theme',
                backgroundThemeDesc: 'Select the background style.',
                accentColor: 'Accent Color',
                accentColorDesc: 'Pick your primary color.'
            },
            terminal: {
                title: 'Terminal Settings',
                fontFamily: 'Font Family',
                fontFamilyDesc: 'Choose the font for the terminal interface.',
                fontSize: 'Font Size',
                lineHeight: 'Line Height',
                letterSpacing: 'Letter Spacing',
                cursorStyle: 'Cursor Style',
                cursorBlink: 'Cursor Blink',
                rendering: 'Rendering',
                rendererType: 'Frontend Implementation',
                rendererTypeDesc: 'Switch between canvas (stable) and webgl (fast, experimental).',
                scrollback: 'Scrollback Buffer',
                scrollbackDesc: 'Lines to keep in history.',
                brightBold: 'Bright Bold Text',
                brightBoldDesc: 'Render bold text in bright colors.',
                sound: 'Sound',
                bellStyle: 'Terminal Bell'
            },
            ai: {
                title: 'AI Assistant',
                desc: 'Configure AI services to enable natural language to command, error analysis, and more.',
                enable: 'Enable AI',
                enableDesc: 'Show AI chat box below the terminal.',
                provider: 'AI Provider',
                providerDesc: 'Select your AI API provider.',
                apiKey: 'API Key',
                apiKeyDesc: 'Enter your API Key (stored securely locally).',
                baseUrl: 'Custom Base URL',
                baseUrlDesc: 'Enter your API endpoint URL.',
                model: 'Model (Optional)',
                modelDesc: 'Leave empty to use default model:',
                privacy: 'Privacy Mode',
                privacyDesc: 'Automatically mask sensitive info like IPs and passwords.',
                shortcut: 'Send Shortcut',
                shortcutDesc: 'Choose the shortcut to send messages.'
            },
            about: {
                title: 'About',
                desc: 'SSH Tool v1.0.0\nPowered by Electron, React, and Shadcn UI.'
            },
            back: 'Back'
        },
        common: {
            connect: 'Connect',
            disconnect: 'Disconnect',
            edit: 'Edit',
            delete: 'Delete',
            cancel: 'Cancel',
            save: 'Save'
        },
        connection: {
            new: 'New Connection',
            host: 'Host',
            port: 'Port',
            username: 'Username',
            password: 'Password',
            name: 'Name',
            noConnections: 'No connections found. Create one to get started.'
        }
    },
    zh: {
        settings: {
            title: '设置',
            tabs: {
                app: '应用',
                appearance: '外观',
                terminal: '终端',
                ai: 'AI 智能'
            },
            appearance: {
                title: '外观设置',
                theme: '主题',
                themeDesc: '选择一个主题以自定义应用程序的外观。',
                language: '语言',
                languageDesc: '选择您的首选语言。',
                font: '界面字体',
                fontDesc: '选择应用程序界面的字体。',
                opacity: '窗口透明度',
                backgroundTheme: '背景主题',
                backgroundThemeDesc: '选择背景样式。',
                accentColor: '强调色',
                accentColorDesc: '选择您的主色调。'
            },
            terminal: {
                title: '终端设置',
                fontFamily: '终端字体',
                fontFamilyDesc: '选择终端界面的字体。',
                fontSize: '字体大小',
                lineHeight: '行高',
                letterSpacing: '字符间距',
                cursorStyle: '光标样式',
                cursorBlink: '光标闪烁',
                rendering: '渲染',
                rendererType: '前端实现',
                rendererTypeDesc: '在 Canvas（稳定）和 WebGL（快速，实验性）之间切换。',
                scrollback: '回滚缓冲区',
                scrollbackDesc: '保留的历史行数。',
                brightBold: '高亮粗体文本',
                brightBoldDesc: '以高亮颜色渲染粗体文本。',
                sound: '声音',
                bellStyle: '终端铃声'
            },
            ai: {
                title: 'AI 智能助手',
                desc: '配置 AI 服务以启用自然语言转指令、智能报错分析等功能。',
                enable: '启用 AI 功能',
                enableDesc: '开启后在终端下方显示 AI 对话框。',
                provider: 'AI 服务商',
                providerDesc: '选择您的 AI API 提供商。',
                apiKey: 'API Key',
                apiKeyDesc: '填入您的 API 密钥 (将安全存储在本地)。',
                baseUrl: '自定义 Base URL',
                baseUrlDesc: '输入您的 API 端点地址。',
                model: '模型 (可选)',
                modelDesc: '留空使用默认模型:',
                privacy: '隐私模式',
                privacyDesc: '开启后将自动脱敏 IP、密码等敏感信息。',
                shortcut: '发送快捷键',
                shortcutDesc: '选择生成指令时使用的快捷键方式。'
            },
            about: {
                title: '关于',
                desc: 'SSH Tool v1.0.0\n基于 Electron, React, 和 Shadcn UI 构建。'
            },
            back: '返回'
        },
        common: {
            connect: '连接',
            disconnect: '断开连接',
            edit: '编辑',
            delete: '删除',
            cancel: '取消',
            save: '保存'
        },
        connection: {
            new: '新建连接',
            host: '主机',
            port: '端口',
            username: '用户名',
            password: '密码',
            name: '名称',
            noConnections: '未找到连接。创建一个以开始。'
        }
    },
    ja: {
        settings: {
            title: '設定',
            tabs: {
                app: 'アプリ',
                appearance: '外観',
                terminal: 'ターミナル',
                ai: 'AI'
            },
            appearance: {
                title: '外観',
                theme: 'テーマ',
                themeDesc: 'アプリケーションの外観をカスタマイズするにはテーマを選択してください。',
                language: '言語',
                languageDesc: '希望の言語を選択してください。',
                font: 'UIフォント',
                fontDesc: 'UIのフォントを選択してください。',
                opacity: 'ウィンドウの不透明度',
                backgroundTheme: '背景テーマ',
                backgroundThemeDesc: '背景スタイルを選択してください。',
                accentColor: 'アクセントカラー',
                accentColorDesc: 'メインカラーを選択してください。'
            },
            terminal: {
                title: 'ターミナル設定',
                fontFamily: 'フォント',
                fontFamilyDesc: 'ターミナルのフォントを選択してください。',
                fontSize: 'フォントサイズ',
                lineHeight: '行の高さ',
                letterSpacing: '文字間隔',
                cursorStyle: 'カーソルスタイル',
                cursorBlink: 'カーソル点滅',
                rendering: 'レンダリング',
                rendererType: 'フロントエンド実装',
                rendererTypeDesc: 'Canvas（安定）と WebGL（高速、実験的）を切り替えます。',
                scrollback: 'スクロールバックバッファ',
                scrollbackDesc: '履歴に保持する行数。',
                brightBold: '明るい太字テキスト',
                brightBoldDesc: '太字テキストを明るい色でレンダリングします。',
                sound: 'サウンド',
                bellStyle: 'ターミナルベル'
            },
            ai: {
                title: 'AIアシスタント',
                desc: '自然言語コマンドやエラー分析などを有効にするためにAIサービスを設定します。',
                enable: 'AIを有効にする',
                enableDesc: 'ターミナルの下にAIチャットボックスを表示します。',
                provider: 'AIプロバイダー',
                providerDesc: 'AI APIプロバイダーを選択してください。',
                apiKey: 'APIキー',
                apiKeyDesc: 'APIキーを入力してください（ローカルに安全に保存されます）。',
                baseUrl: 'カスタムBase URL',
                baseUrlDesc: 'APIエンドポイントのURLを入力してください。',
                model: 'モデル (オプション)',
                modelDesc: 'デフォルトモデルを使用する場合は空欄にしてください:',
                privacy: 'プライバシーモード',
                privacyDesc: 'IPやパスワードなどの機密情報を自動的にマスクします。',
                shortcut: '送信ショートカット',
                shortcutDesc: 'メッセージを送信するショートカットを選択してください。'
            },
            about: {
                title: '詳細',
                desc: 'SSH Tool v1.0.0\nElectron, React, Shadcn UI を使用しています。'
            },
            back: '戻る'
        },
        common: {
            connect: '接続',
            disconnect: '切断',
            edit: '編集',
            delete: '削除',
            cancel: 'キャンセル',
            save: '保存'
        },
        connection: {
            new: '新規接続',
            host: 'ホスト',
            port: 'ポート',
            username: 'ユーザー名',
            password: 'パスワード',
            name: '名前',
            noConnections: '接続が見つかりません。新しい接続を作成してください。'
        }
    },
    ko: {
        settings: {
            title: '설정',
            tabs: {
                app: '앱',
                appearance: '모양',
                terminal: '터미널',
                ai: 'AI'
            },
            appearance: {
                title: '모양',
                theme: '테마',
                themeDesc: '애플리케이션의 모양을 사용자 지정하려면 테마를 선택하세요.',
                language: '언어',
                languageDesc: '선호하는 언어를 선택하세요.',
                font: 'UI 글꼴',
                fontDesc: 'UI의 글꼴을 선택하세요.',
                opacity: '창 투명도',
                backgroundTheme: '배경 테마',
                backgroundThemeDesc: '배경 스타일을 선택하세요.',
                accentColor: '강조 색상',
                accentColorDesc: '기본 색상을 선택하세요.'
            },
            terminal: {
                title: '터미널 설정',
                fontFamily: '글꼴',
                fontFamilyDesc: '터미널 인터페이스의 글꼴을 선택하세요.',
                fontSize: '글꼴 크기',
                lineHeight: '줄 높이',
                letterSpacing: '자간',
                cursorStyle: '커서 스타일',
                cursorBlink: '커서 깜박임',
                rendering: '렌더링',
                rendererType: '프론트엔드 구현',
                rendererTypeDesc: 'Canvas(안정)와 WebGL(빠름, 실험적) 간 전환.',
                scrollback: '스크롤백 버퍼',
                scrollbackDesc: '기록에 유지할 줄 수.',
                brightBold: '밝은 굵은 텍스트',
                brightBoldDesc: '굵은 텍스트를 밝은 색상으로 렌더링합니다.',
                sound: '소리',
                bellStyle: '터미널 벨'
            },
            ai: {
                title: 'AI 도우미',
                desc: '자연어 명령, 오류 분석 등의 기능을 활성화하려면 AI 서비스를 구성하세요.',
                enable: 'AI 활성화',
                enableDesc: '터미널 아래에 AI 채팅 상자를 표시합니다.',
                provider: 'AI 공급자',
                providerDesc: 'AI API 공급자를 선택하세요.',
                apiKey: 'API 키',
                apiKeyDesc: 'API 키를 입력하세요 (로컬에 안전하게 저장됨).',
                baseUrl: '사용자 지정 Base URL',
                baseUrlDesc: 'API 엔드포인트 URL을 입력하세요.',
                model: '모델 (선택 사항)',
                modelDesc: '기본 모델을 사용하려면 비워 두세요:',
                privacy: '개인 정보 보호 모드',
                privacyDesc: 'IP 및 비밀번호와 같은 민감한 정보를 자동으로 마스킹합니다.',
                shortcut: '전송 단축키',
                shortcutDesc: '메시지를 전송할 단축키를 선택하세요.'
            },
            about: {
                title: '정보',
                desc: 'SSH Tool v1.0.0\nElectron, React, Shadcn UI 구동.'
            },
            back: '뒤로'
        },
        common: {
            connect: '연결',
            disconnect: '연결 끊기',
            edit: '편집',
            delete: '삭제',
            cancel: '취소',
            save: '저장'
        },
        connection: {
            new: '새 연결',
            host: '호스트',
            port: '포트',
            username: '사용자 이름',
            password: '비밀번호',
            name: '이름',
            noConnections: '연결을 찾을 수 없습니다. 시작하려면 연결을 생성하세요.'
        }
    }
};

export type Language = keyof typeof translations;
export type TranslationKey = string; // Simplified for now, could be recursive keyof
