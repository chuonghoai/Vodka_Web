import { ActivityDto } from '../../../models/dashboard.model';

export function mapActivitiesToView(list: ActivityDto[]): ActivityView[] {
    return list.map(a => {
        const hasAvatar = !!a.actorAvatar;
        const isUpdated = a.updatedAt > a.createdAt;
        const action = isUpdated ? 'đã cập nhật' : 'đã tạo';
        const displayTime = isUpdated ? a.updatedAt : a.createdAt;

        return {
            type: hasAvatar ? 'avatar' : 'icon',
            avatarUrl: a.actorAvatar ?? undefined,
            iconName: hasAvatar ? undefined : 'notifications',
            iconBgColor: hasAvatar ? undefined : 'bg-red-600/10',
            iconTextColor: hasAvatar ? undefined : 'text-red-600',
            actor: a.actorName,
            action: `${action} ${a.entityType}`,
            target: a.targetName,
            targetClass: 'text-white font-medium',
            time: timeAgo(displayTime),
        } as ActivityView;
    });
}

export function timeAgo(isoDate: string): string {
    const now = Date.now();
    const then = new Date(isoDate).getTime();
    const diffMs = now - then;
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} ngày trước`;
    return `${Math.floor(days / 30)} tháng trước`;
}
