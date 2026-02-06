export const translations = {
    en: {
        settings: {
            title: 'Settings',
            appearance: {
                title: 'Appearance',
                theme: 'Theme',
                themeDesc: 'Select a theme to customize the look and feel of the application.',
                language: 'Language',
                languageDesc: 'Select your preferred language.',
                font: 'Font Family',
                fontDesc: 'Choose the font for the UI and Terminal.',
                fontPlaceholder: 'Select a font'
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
            appearance: {
                title: '外观',
                theme: '主题',
                themeDesc: '选择一个主题以自定义应用程序的外观。',
                language: '语言',
                languageDesc: '选择您的首选语言。',
                font: '字体',
                fontDesc: '选择界面和终端的字体。',
                fontPlaceholder: '选择字体'
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
            appearance: {
                title: '外観',
                theme: 'テーマ',
                themeDesc: 'アプリケーションの外観をカスタマイズするにはテーマを選択してください。',
                language: '言語',
                languageDesc: '希望の言語を選択してください。',
                font: 'フォント',
                fontDesc: 'UIとターミナルのフォントを選択してください。',
                fontPlaceholder: 'フォントを選択'
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
            appearance: {
                title: '모양',
                theme: '테마',
                themeDesc: '애플리케이션의 모양을 사용자 지정하려면 테마를 선택하세요.',
                language: '언어',
                languageDesc: '선호하는 언어를 선택하세요.',
                font: '글꼴',
                fontDesc: 'UI 및 터미널의 글꼴을 선택하세요.',
                fontPlaceholder: '글꼴 선택'
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
