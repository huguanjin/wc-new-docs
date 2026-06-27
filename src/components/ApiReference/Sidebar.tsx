import type {ReactNode} from 'react';
import clsx from 'clsx';
import Translate, {translate} from '@docusaurus/Translate';
import type {ApiCatalog, FlatEndpoint} from '@site/src/types/apiCatalog';
import styles from './styles.module.css';

type Props = {
  catalog: ApiCatalog;
  endpoints: FlatEndpoint[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
};

function methodClass(method: string): string {
  const m = method.toLowerCase();
  if (m === 'get') return styles.methodGet;
  if (m === 'post') return styles.methodPost;
  if (m === 'put') return styles.methodPut;
  if (m === 'patch') return styles.methodPatch;
  if (m === 'delete') return styles.methodDelete;
  return styles.methodDefault;
}

export default function ApiSidebar({
  catalog,
  endpoints,
  selectedId,
  onSelect,
  search,
  onSearchChange,
}: Props): ReactNode {
  const query = search.trim().toLowerCase();
  const filteredIds = query
    ? new Set(
        endpoints
          .filter(
            ep =>
              ep.summary.toLowerCase().includes(query) ||
              ep.path.toLowerCase().includes(query) ||
              ep.method.toLowerCase().includes(query) ||
              ep.categoryLabel.toLowerCase().includes(query),
          )
          .map(ep => ep.id),
      )
    : null;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <span className={styles.sidebarTitle}>
          <Translate id="api.ref.navTitle">API Reference</Translate>
        </span>
        <input
          type="search"
          className={styles.searchInput}
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder={translate({id: 'api.ref.search', message: 'Search endpoints…'})}
          aria-label={translate({id: 'api.ref.search', message: 'Search endpoints'})}
        />
      </div>
      <nav className={styles.sidebarNav}>
        {catalog.categories.map(category => {
          const visibleSections = category.sections
            .map(section => ({
              ...section,
              endpoints: section.endpoints.filter(
                ep => !filteredIds || filteredIds.has(ep.id),
              ),
            }))
            .filter(section => section.endpoints.length > 0);

          if (visibleSections.length === 0) return null;

          return (
            <div key={category.slug} className={styles.navGroup}>
              <div className={styles.navGroupTitle}>{category.label}</div>
              {visibleSections.map(section => (
                <div key={`${category.slug}-${section.id}`} className={styles.navSection}>
                  <div className={styles.navSectionTitle}>{section.label}</div>
                  <ul className={styles.navList}>
                    {section.endpoints.map(ep => (
                      <li key={ep.id}>
                        <button
                          type="button"
                          className={clsx(
                            styles.navItem,
                            selectedId === ep.id && styles.navItemActive,
                          )}
                          onClick={() => onSelect(ep.id)}>
                          <span className={clsx(styles.methodBadge, methodClass(ep.method))}>
                            {ep.method}
                          </span>
                          <span className={styles.navItemLabel}>
                            {ep.summary}
                            {ep.variantCount != null && ep.variantCount > 1 && (
                              <span className={styles.navVariantCount}>{ep.variantCount}</span>
                            )}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          );
        })}
        {filteredIds && filteredIds.size === 0 && (
          <p className={styles.noResults}>
            <Translate id="api.ref.noResults">No endpoints match your search.</Translate>
          </p>
        )}
      </nav>
    </aside>
  );
}
