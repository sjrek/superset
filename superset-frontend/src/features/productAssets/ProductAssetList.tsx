/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { useState, useMemo } from 'react';
import { styled, t } from '@superset-ui/core';
import SubMenu, { SubMenuProps } from 'src/features/home/SubMenu';
import { ProductAsset, AssetType, AssetStatus } from './types';

// ---------- Static mock data ----------
const MOCK_ASSETS: ProductAsset[] = [
  {
    id: 1,
    name: '月度销售额趋势分析',
    type: '图表',
    owner: '张伟',
    department: '数据分析部',
    createdOn: '2024-01-15',
    lastModified: '2024-03-20',
    status: '已发布',
    description: '按月统计各区域销售额，支持同比/环比对比',
    tags: ['销售', '趋势'],
  },
  {
    id: 2,
    name: '用户增长仪表盘',
    type: '仪表盘',
    owner: '李娜',
    department: '产品部',
    createdOn: '2024-02-01',
    lastModified: '2024-04-10',
    status: '已发布',
    description: '综合展示日/周/月活跃用户及新增用户数据',
    tags: ['用户', '增长'],
  },
  {
    id: 3,
    name: '订单明细数据集',
    type: '数据集',
    owner: '王芳',
    department: '研发部',
    createdOn: '2023-11-05',
    lastModified: '2024-03-31',
    status: '已发布',
    description: '包含订单ID、商品、金额、状态等核心字段',
    tags: ['订单', '交易'],
  },
  {
    id: 4,
    name: '库存预警看板',
    type: '仪表盘',
    owner: '刘洋',
    department: '供应链部',
    createdOn: '2024-03-10',
    lastModified: '2024-04-01',
    status: '草稿',
    description: '实时监控各SKU库存水位，低于阈值时触发预警',
    tags: ['库存', '预警'],
  },
  {
    id: 5,
    name: '用户行为日志DB',
    type: '数据库',
    owner: '陈强',
    department: '研发部',
    createdOn: '2023-08-20',
    lastModified: '2024-02-15',
    status: '已发布',
    description: '记录用户点击、浏览、购买等行为事件',
    tags: ['用户行为', '日志'],
  },
  {
    id: 6,
    name: '财务收支对比图',
    type: '图表',
    owner: '赵磊',
    department: '财务部',
    createdOn: '2024-01-20',
    lastModified: '2024-04-05',
    status: '已归档',
    description: '按季度展示收入与支出的对比关系',
    tags: ['财务', '收支'],
  },
  {
    id: 7,
    name: '客户分层分析',
    type: '图表',
    owner: '孙静',
    department: '市场部',
    createdOn: '2024-02-28',
    lastModified: '2024-04-08',
    status: '草稿',
    description: '基于RFM模型对客户价值进行分层',
    tags: ['客户', 'RFM'],
  },
  {
    id: 8,
    name: '商品主数据集',
    type: '数据集',
    owner: '吴涛',
    department: '电商部',
    createdOn: '2023-09-15',
    lastModified: '2024-03-25',
    status: '已发布',
    description: '包含商品SKU、分类、价格、库存等属性',
    tags: ['商品', '主数据'],
  },
];

// ---------- Styled components ----------
const PageWrapper = styled.div`
  padding: ${({ theme }) => theme.gridUnit * 4}px;
`;

const ToolbarRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.gridUnit * 3}px;
  margin-bottom: ${({ theme }) => theme.gridUnit * 4}px;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  border: 1px solid ${({ theme }) => theme.colors.grayscale.light2};
  border-radius: ${({ theme }) => theme.borderRadius}px;
  padding: ${({ theme }) => theme.gridUnit * 2}px
    ${({ theme }) => theme.gridUnit * 3}px;
  font-size: ${({ theme }) => theme.typography.sizes.m}px;
  width: 260px;
  outline: none;
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary.base};
  }
`;

const FilterSelect = styled.select`
  border: 1px solid ${({ theme }) => theme.colors.grayscale.light2};
  border-radius: ${({ theme }) => theme.borderRadius}px;
  padding: ${({ theme }) => theme.gridUnit * 2}px
    ${({ theme }) => theme.gridUnit * 3}px;
  font-size: ${({ theme }) => theme.typography.sizes.m}px;
  background: #fff;
  cursor: pointer;
  outline: none;
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary.base};
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: ${({ theme }) => theme.borderRadius}px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);

  thead {
    background: ${({ theme }) => theme.colors.grayscale.light4};
    th {
      padding: ${({ theme }) => theme.gridUnit * 3}px
        ${({ theme }) => theme.gridUnit * 4}px;
      text-align: left;
      font-weight: ${({ theme }) => theme.typography.weights.bold};
      font-size: ${({ theme }) => theme.typography.sizes.s}px;
      color: ${({ theme }) => theme.colors.grayscale.dark1};
      white-space: nowrap;
      cursor: pointer;
      user-select: none;
      &:hover {
        background: ${({ theme }) => theme.colors.grayscale.light3};
      }
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.light3};
      &:hover {
        background: ${({ theme }) => theme.colors.primary.light5};
      }
      td {
        padding: ${({ theme }) => theme.gridUnit * 3}px
          ${({ theme }) => theme.gridUnit * 4}px;
        font-size: ${({ theme }) => theme.typography.sizes.m}px;
        color: ${({ theme }) => theme.colors.grayscale.dark2};
        vertical-align: middle;
      }
    }
  }
`;

interface StatusBadgeProps {
  status: AssetStatus;
}

const STATUS_COLOR_MAP: Record<AssetStatus, string> = {
  已发布: '#52c41a',
  草稿: '#faad14',
  已归档: '#8c8c8c',
};

const StatusBadge = styled.span<StatusBadgeProps>`
  display: inline-block;
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
  color: #fff;
  background-color: ${({ status }) => STATUS_COLOR_MAP[status]};
`;

interface TypeBadgeProps {
  assetType: AssetType;
}

const TYPE_COLOR_MAP: Record<AssetType, string> = {
  图表: '#1677ff',
  仪表盘: '#722ed1',
  数据集: '#13c2c2',
  数据库: '#fa8c16',
};

const TypeBadge = styled.span<TypeBadgeProps>`
  display: inline-block;
  padding: 2px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: ${({ assetType }) => TYPE_COLOR_MAP[assetType]};
  background-color: ${({ assetType }) => TYPE_COLOR_MAP[assetType]}1a;
  border: 1px solid ${({ assetType }) => TYPE_COLOR_MAP[assetType]}33;
`;

const Tag = styled.span`
  display: inline-block;
  margin-right: 4px;
  padding: 1px 7px;
  border-radius: 10px;
  font-size: 11px;
  background: ${({ theme }) => theme.colors.grayscale.light3};
  color: ${({ theme }) => theme.colors.grayscale.dark1};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: 4px 8px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary.base};
  font-size: 13px;
  border-radius: 4px;
  &:hover {
    background: ${({ theme }) => theme.colors.primary.light5};
  }
  &.danger {
    color: ${({ theme }) => theme.colors.error.base};
    &:hover {
      background: ${({ theme }) => theme.colors.error.light2};
    }
  }
`;

const StatsRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.gridUnit * 4}px;
  margin-bottom: ${({ theme }) => theme.gridUnit * 5}px;
  flex-wrap: wrap;
`;

const StatCard = styled.div`
  background: #fff;
  border-radius: ${({ theme }) => theme.borderRadius}px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  padding: ${({ theme }) => theme.gridUnit * 4}px
    ${({ theme }) => theme.gridUnit * 6}px;
  min-width: 140px;
  text-align: center;

  .stat-value {
    font-size: 28px;
    font-weight: ${({ theme }) => theme.typography.weights.bold};
    color: ${({ theme }) => theme.colors.primary.base};
    line-height: 1.2;
  }

  .stat-label {
    font-size: 13px;
    color: ${({ theme }) => theme.colors.grayscale.base};
    margin-top: 4px;
  }
`;

const PaginationRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: ${({ theme }) => theme.gridUnit * 4}px;
  gap: ${({ theme }) => theme.gridUnit * 2}px;
`;

const PageBtn = styled.button<{ active?: boolean }>`
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  border-radius: 4px;
  border: 1px solid
    ${({ theme, active }) =>
      active ? theme.colors.primary.base : theme.colors.grayscale.light2};
  background: ${({ theme, active }) =>
    active ? theme.colors.primary.base : '#fff'};
  color: ${({ theme, active }) =>
    active ? '#fff' : theme.colors.grayscale.dark2};
  cursor: pointer;
  font-size: 13px;
  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary.base};
    color: ${({ theme, active }) =>
      active ? '#fff' : theme.colors.primary.base};
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

// ---------- Helpers ----------
type SortDir = 'asc' | 'desc';

const PAGE_SIZE = 5;

function ProductAssetList() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<AssetType | ''>('');
  const [statusFilter, setStatusFilter] = useState<AssetStatus | ''>('');
  const [sortKey, setSortKey] =
    useState<keyof ProductAsset>('lastModified');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);

  const handleSort = (key: keyof ProductAsset) => {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(1);
  };

  const sortIcon = (key: keyof ProductAsset) => {
    if (sortKey !== key) return ' ↕';
    return sortDir === 'asc' ? ' ↑' : ' ↓';
  };

  const filtered = useMemo(() => {
    let data = MOCK_ASSETS;
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        a =>
          a.name.toLowerCase().includes(q) ||
          a.owner.toLowerCase().includes(q) ||
          a.department.toLowerCase().includes(q),
      );
    }
    if (typeFilter) data = data.filter(a => a.type === typeFilter);
    if (statusFilter) data = data.filter(a => a.status === statusFilter);
    data = [...data].sort((a, b) => {
      const av = a[sortKey] as string;
      const bv = b[sortKey] as string;
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return data;
  }, [search, typeFilter, statusFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageData = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  // Stats
  const stats = useMemo(
    () => [
      { label: t('总资产'), value: MOCK_ASSETS.length },
      {
        label: t('已发布'),
        value: MOCK_ASSETS.filter(a => a.status === '已发布').length,
      },
      {
        label: t('草稿'),
        value: MOCK_ASSETS.filter(a => a.status === '草稿').length,
      },
      {
        label: t('已归档'),
        value: MOCK_ASSETS.filter(a => a.status === '已归档').length,
      },
    ],
    [],
  );

  const subMenuButtons: SubMenuProps['buttons'] = [
    {
      name: (
        <>
          <i className="fa fa-plus" /> {t('新建资产')}
        </>
      ),
      buttonStyle: 'primary',
      onClick: () => {
        /* placeholder – static page */
      },
    },
    {
      name: t('导入资产'),
      buttonStyle: 'secondary',
      onClick: () => {
        /* placeholder */
      },
    },
  ];

  return (
    <>
      <SubMenu name={t('产品资产管理')} buttons={subMenuButtons} />
      <PageWrapper>
        {/* Stats cards */}
        <StatsRow>
          {stats.map(s => (
            <StatCard key={s.label}>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </StatCard>
          ))}
        </StatsRow>

        {/* Toolbar */}
        <ToolbarRow>
          <SearchInput
            placeholder={t('搜索资产名称、负责人、部门…')}
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <FilterSelect
            value={typeFilter}
            onChange={e => {
              setTypeFilter(e.target.value as AssetType | '');
              setPage(1);
            }}
          >
            <option value="">{t('全部类型')}</option>
            <option value="图表">{t('图表')}</option>
            <option value="仪表盘">{t('仪表盘')}</option>
            <option value="数据集">{t('数据集')}</option>
            <option value="数据库">{t('数据库')}</option>
          </FilterSelect>
          <FilterSelect
            value={statusFilter}
            onChange={e => {
              setStatusFilter(e.target.value as AssetStatus | '');
              setPage(1);
            }}
          >
            <option value="">{t('全部状态')}</option>
            <option value="已发布">{t('已发布')}</option>
            <option value="草稿">{t('草稿')}</option>
            <option value="已归档">{t('已归档')}</option>
          </FilterSelect>
          <span style={{ marginLeft: 'auto', color: '#8c8c8c', fontSize: 13 }}>
            {t('共')} {filtered.length} {t('条记录')}
          </span>
        </ToolbarRow>

        {/* Table */}
        <StyledTable>
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>
                {t('资产名称')}
                {sortIcon('name')}
              </th>
              <th onClick={() => handleSort('type')}>
                {t('资产类型')}
                {sortIcon('type')}
              </th>
              <th onClick={() => handleSort('owner')}>
                {t('负责人')}
                {sortIcon('owner')}
              </th>
              <th onClick={() => handleSort('department')}>
                {t('所属部门')}
                {sortIcon('department')}
              </th>
              <th onClick={() => handleSort('lastModified')}>
                {t('最近更新')}
                {sortIcon('lastModified')}
              </th>
              <th onClick={() => handleSort('status')}>
                {t('状态')}
                {sortIcon('status')}
              </th>
              <th>{t('标签')}</th>
              <th>{t('操作')}</th>
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  style={{ textAlign: 'center', padding: '48px 0' }}
                >
                  {t('暂无数据')}
                </td>
              </tr>
            ) : (
              pageData.map(asset => (
                <tr key={asset.id}>
                  <td>
                    <strong>{asset.name}</strong>
                    <div
                      style={{
                        fontSize: 12,
                        color: '#8c8c8c',
                        marginTop: 2,
                      }}
                    >
                      {asset.description}
                    </div>
                  </td>
                  <td>
                    <TypeBadge assetType={asset.type}>{asset.type}</TypeBadge>
                  </td>
                  <td>{asset.owner}</td>
                  <td>{asset.department}</td>
                  <td>{asset.lastModified}</td>
                  <td>
                    <StatusBadge status={asset.status}>
                      {asset.status}
                    </StatusBadge>
                  </td>
                  <td>
                    {asset.tags.map(tag => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <ActionButton title={t('查看')}>
                      {t('查看')}
                    </ActionButton>
                    <ActionButton title={t('编辑')}>
                      {t('编辑')}
                    </ActionButton>
                    <ActionButton className="danger" title={t('删除')}>
                      {t('删除')}
                    </ActionButton>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </StyledTable>

        {/* Pagination */}
        <PaginationRow>
          <PageBtn
            disabled={currentPage <= 1}
            onClick={() => setPage(p => p - 1)}
          >
            &laquo;
          </PageBtn>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <PageBtn
              key={p}
              active={p === currentPage}
              onClick={() => setPage(p)}
            >
              {p}
            </PageBtn>
          ))}
          <PageBtn
            disabled={currentPage >= totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            &raquo;
          </PageBtn>
        </PaginationRow>
      </PageWrapper>
    </>
  );
}

export default ProductAssetList;
