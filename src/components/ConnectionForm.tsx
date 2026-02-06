import { useEffect, useState } from 'react';
import { SSHConnection } from '../shared/types';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useTranslation } from '../hooks/useTranslation';

interface ConnectionFormProps {
    initialData?: Partial<SSHConnection>;
    onSave: (data: SSHConnection) => void;
    onCancel: () => void;
}

export function ConnectionForm({ initialData, onSave, onCancel }: ConnectionFormProps) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState<Partial<SSHConnection>>({
        name: '',
        host: '',
        port: 22,
        username: '',
        password: '',
        authType: 'password',
        ...initialData
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as SSHConnection); // Validation logic could be added here
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
                <label className="text-sm font-medium">{t('connection.name')}</label>
                <Input
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder={formData.host ? `${formData.username || 'root'}@${formData.host}` : t('connection.name')}
                />
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 grid gap-2">
                    <label className="text-sm font-medium">{t('connection.host')}</label>
                    <Input
                        value={formData.host}
                        onChange={e => setFormData({ ...formData, host: e.target.value })}
                        placeholder="192.168.1.1"
                        required
                    />
                </div>
                <div className="grid gap-2">
                    <label className="text-sm font-medium">{t('connection.port')}</label>
                    <Input
                        type="number"
                        value={formData.port}
                        onChange={e => setFormData({ ...formData, port: parseInt(e.target.value) || 22 })}
                        required
                    />
                </div>
            </div>
            <div className="grid gap-2">
                <label className="text-sm font-medium">{t('connection.username')}</label>
                <Input
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                    placeholder="root"
                />
            </div>
            <div className="grid gap-2">
                <label className="text-sm font-medium">{t('connection.password')}</label>
                <Input
                    type="password"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                />
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="ghost" onClick={onCancel}>
                    {t('common.cancel')}
                </Button>
                <Button type="submit">
                    {t('common.save')}
                </Button>
            </div>
        </form>
    );
}
