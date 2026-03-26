import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

interface UserRow {
  id: number;
  fullName: string;
  email: string;
  avatarUrl: string;
  provider: 'Google' | 'Email';
  gender: string;
  dateOfBirth: string;
  status: 'Active' | 'Locked';
  phone?: string;
  moviesWatched?: number;
  reviewsCount?: number;
}

interface UserStat {
  icon: string;
  label: string;
  value: string;
  description: string;
  badgeText: string;
  badgeColor: string;
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './user-management.html',
})
export class UserManagementComponent {
  //  Filters 
  selectedStatus = signal('Trạng thái: All');
  selectedProvider = signal('Provider: All');
  selectedGender = signal('Giới tính: All');
  selectedSort = signal('Sắp xếp: Mới nhất');
  searchQuery = signal('');

  //  Summary Stats 
  userStats = signal<UserStat[]>([
    {
      icon: 'group',
      label: 'User Total',
      value: '5,678',
      description: 'Tổng số người dùng hệ thống',
      badgeText: 'User Total',
      badgeColor: 'zinc',
    },
    {
      icon: 'person_play',
      label: 'Active',
      value: '4,230',
      description: 'Đang hoạt động trong 30 ngày',
      badgeText: 'ACTIVE',
      badgeColor: 'emerald',
    },
    {
      icon: 'block',
      label: 'Locked',
      value: '45',
      description: 'Tài khoản bị tạm khóa',
      badgeText: 'Locked',
      badgeColor: 'red',
    },
    {
      icon: 'person_add',
      label: 'New Today',
      value: '23',
      description: 'Lượt đăng ký mới hôm nay',
      badgeText: 'Today',
      badgeColor: 'blue',
    },
  ]);

  //  User Data 
  users = signal<UserRow[]>([
    {
      id: 1,
      fullName: 'Nguyễn Văn A',
      email: 'vanA@gmail.com',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApp_YTMzMfQYj-5JAi8VpptWjXlriLSdbArgdqUwvx1usobq5DexvAtAXfXR3QeioX1DdKMJ7ojxjgMhZTvv3u0Q0UQuMiMTKROqjlZop_TgmCdfPD2XWYp1FW2ytmyp7-wNNm7sl2JXED3icrSfjwrhTUsnHJvlanD0KI0z3ooW9X5xJMBrBE3LjucWq48EfEjWu4kAWDU_8UtP1GSsRkJNrv1rtLzkqWfZxF0PsibxWuMrQMWiI7AW-zjTAjoa7Dx-Lv5wtNrQ',
      provider: 'Google',
      gender: 'Nam',
      dateOfBirth: '15/03/1999',
      status: 'Active',
      phone: '0901 234 567',
      moviesWatched: 124,
      reviewsCount: 42,
    },
    {
      id: 2,
      fullName: 'Trần Thị B',
      email: 'thiB@gmail.com',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmArQzlLBtHpwtz5oDxA8l88ds4_dMPlf4O8kCVIBBGpRHgRpyoAF8NhjfnqelrhGaozyI4H_0l7EHsJpxW1fmFpsbWZem-oOFDFnwxnosq54DpVGGgPAbJ_p1OBbm31GHoVUWBq7DooSUMmQI24PuGCusZs3QqNtkLhGrQt3muvIuAKVyitOCjccNu1wLiPmRWDCYVFXYuCAy-EBX5okUagHND18dvUPTzKX1cD86RLG0PERn-yqJzyAG3CR6_OmyTOiBqyIrUA',
      provider: 'Email',
      gender: 'Nữ',
      dateOfBirth: '22/07/2001',
      status: 'Active',
      phone: '0912 345 678',
      moviesWatched: 87,
      reviewsCount: 15,
    },
    {
      id: 3,
      fullName: 'Lê Văn C',
      email: 'vanC@yahoo.com',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrJk99GJIUiMLbHMliY7S2V9Quy_ycYk7NFPY3pYFMqr5Yf0L1v-TguXrIo6QOedkmDejRVniVPS602R3v8lU-Jy5EiX6WGkheHD-jh8-J_nbFEAUUDuGVluhqhYi-4sLFCvbiAfddoW9zGZxMurevvmJYRwLbfY0zmMyOUq_lE3t3XJ3UnBvyM9Gfe402LUHzGelVngjpl_qpozHpMqvM-addknp5HG9b8Sc34mGXem31irLPqGYDpt3AfqRAzQBVkqbHPIT2yg',
      provider: 'Email',
      gender: 'Nam',
      dateOfBirth: '08/11/1995',
      status: 'Locked',
      phone: '0923 456 789',
      moviesWatched: 56,
      reviewsCount: 8,
    },
    {
      id: 4,
      fullName: 'Phạm Minh D',
      email: 'minhD@gmail.com',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7RqQIixAxHQl38A8v3M2M-mnexLB3pxKjBgkiTAY7vWru-xU3wcmd3lEr7Te43B14BvvpQpoB2YUTHVGEN9DeBCyA-fCpiktGcbBZ_K0PXV4qXTU1c5jpK-MQmj5lpDxpXhq1oukuSJ_rCauasplCRAkQaADc8EfOagEKzDaOpnjGvW6gbyFlJBHdnsDk6nc3oyAFZosyxQIHbmKRmDhSl6ab92BagpvzDxaDX4US7vtfaxEIxl6cVYLKfsrOzNOlqD0NQZa6PQ',
      provider: 'Google',
      gender: 'Nam',
      dateOfBirth: '30/01/2000',
      status: 'Active',
      phone: '0934 567 890',
      moviesWatched: 210,
      reviewsCount: 33,
    },
    {
      id: 5,
      fullName: 'Hoàng Thị E',
      email: 'thiE@hotmail.com',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDV3NCEZ26jpJfXQWgHzsW1mM9PpX3dbvNjpBMbIVY5PZj0cZoRB00yIJJHnj0_tG54pasVoXf1n__ZV54ZHPo8wuQ-ytekcqL7wsox0fF2bfXNK8_giGL7RlE3cKVyQRxKIda4YjvOkKbBZjhblX7B5W0TYhdhVsWswFhK5CV4jlGwPwixHOTRhTnLRkF7eR4vHhlo_y-OUA5klck1DElAXQIbBZvy65GODYUZIRrVa09pQGj4K57GWdCQHvndPhfk5yqPwES72A',
      provider: 'Email',
      gender: 'Nữ',
      dateOfBirth: '14/09/1998',
      status: 'Active',
      phone: '0945 678 901',
      moviesWatched: 45,
      reviewsCount: 19,
    },
    {
      id: 6,
      fullName: 'Đỗ Quang F',
      email: 'quangF@gmail.com',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBD8eiIoAYbcXas1dgxuooq4yvfrpe6KELakybqOysDIsjzf9rOMPAmsSZ45dU5LGoQq2wUjt5EgnYEafKv7QzKPAqHZ98x8rNkI4wfYv_S_OVcIKMoyqzDXp99kpe58f3CvXccBuZqtlN9sZDlLhyLQKQy99Gi5ONai5H84jbAOqqrA4yweFbFUhDeUEPsXDmKsuCE1dUvtWv6GXBMtx3-hKEm5Fu82EhBWTyMbg1MqY2g-bsdCSpwqvNfzOOXwhi1y7H2P-U6Kw',
      provider: 'Google',
      gender: 'Nam',
      dateOfBirth: '05/06/2002',
      status: 'Active',
      phone: '0956 789 012',
      moviesWatched: 178,
      reviewsCount: 27,
    },
    {
      id: 7,
      fullName: 'Vũ Thị G',
      email: 'thiG@gmail.com',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoG3MG6d1v3T_GMfmuZuo4I_WxO8WS_jMc-1zU0uUha32ITy38JsLbwU6CV8f-fX7J-L33iAprOq-YwuMXT-mI9foB6unoe8_gvGVn6iHjK6yW0010pDsjPOMmQTS8NwgEWoXCwNPFNA-sGJdeOhU970WHtM91ZTY4wN-KDbNscd97_5y1f_d_RDERfvYfxIT_0mMLbyGyqQ5FEm6cmUjTRgl1d9gldN6yIjCEnkbd4g4mAui_MT_PZRM7O4i88IeUyJd_Mojvkg',
      provider: 'Email',
      gender: 'Nữ',
      dateOfBirth: '19/12/1997',
      status: 'Locked',
      phone: '0967 890 123',
      moviesWatched: 92,
      reviewsCount: 11,
    },
  ]);

  //  Side Panel 
  selectedUser = signal<UserRow | null>(null);
  showPanel = signal(false);

  //  Pagination 
  currentPage = signal(1);
  totalItems = signal(5678);
  pageSize = signal(10);

  totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));

  pages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: { label: string; value: number | null }[] = [];

    pages.push({ label: '1', value: 1 });

    if (current > 3) {
      pages.push({ label: '...', value: null });
    }

    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push({ label: String(i), value: i });
    }

    if (current < total - 2) {
      pages.push({ label: '...', value: null });
    }

    if (total > 1) {
      pages.push({ label: String(total), value: total });
    }

    return pages;
  });

  showingFrom = computed(() => (this.currentPage() - 1) * this.pageSize() + 1);
  showingTo = computed(() => Math.min(this.currentPage() * this.pageSize(), this.totalItems()));

  //  Helpers 
  getBadgeClasses(color: string): string {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-500/10 text-emerald-500';
      case 'red':
        return 'bg-red-600/10 text-red-500';
      case 'blue':
        return 'bg-blue-500/10 text-blue-500';
      default:
        return 'bg-zinc-800 text-zinc-400';
    }
  }

  getDotClasses(color: string): string {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-500 animate-pulse';
      case 'red':
        return 'bg-red-500';
      case 'blue':
        return 'bg-blue-500';
      default:
        return 'bg-zinc-500';
    }
  }

  getIconColorClass(color: string): string {
    switch (color) {
      case 'emerald':
        return 'text-emerald-500';
      case 'red':
        return 'text-red-500';
      case 'blue':
        return 'text-blue-500';
      default:
        return 'text-zinc-400';
    }
  }

  getHoverBorderClass(color: string): string {
    switch (color) {
      case 'emerald':
        return 'hover:border-emerald-500/30';
      case 'red':
        return 'hover:border-red-500/30';
      case 'blue':
        return 'hover:border-blue-500/30';
      default:
        return 'hover:border-red-600/30';
    }
  }

  formatNumber(num: number): string {
    return num.toLocaleString();
  }

  //  Actions 
  goToPage(page: number | null) {
    if (page !== null && page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  viewUser(user: UserRow) {
    this.selectedUser.set(user);
    this.showPanel.set(true);
  }

  closePanel() {
    this.showPanel.set(false);
    this.selectedUser.set(null);
  }

  lockUser(user: UserRow) {
    const action = user.status === 'Active' ? 'khóa' : 'mở khóa';
    if (confirm(`Bạn muốn ${action} tài khoản "${user.fullName}"?`)) {
      this.users.update(list =>
        list.map(u =>
          u.id === user.id
            ? { ...u, status: u.status === 'Active' ? 'Locked' as const : 'Active' as const }
            : u
        )
      );
    }
  }

  deleteUser(user: UserRow) {
    if (confirm(`Xóa tài khoản "${user.fullName}"?`)) {
      this.users.update(list => list.filter(u => u.id !== user.id));
      if (this.selectedUser()?.id === user.id) {
        this.closePanel();
      }
    }
  }
}
