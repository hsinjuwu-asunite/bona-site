import PageShell from '@/components/PageShell';
import { brands } from '@/lib/data';

export const metadata = { title: 'PARTS日本廠牌list', description: '寶楠科技販售過的日本零組件廠牌清單。' };

export default function JapanBrands() {
  return (
    <PageShell
      hero="/images/products_japan.jpg"
      crumbs={[
        { label: '首頁', href: '/' },
        { label: '產品介紹', href: '/products' },
        { label: '日本進口PARTS' },
        { label: 'PARTS日本廠牌list' },
      ]}
    >
      <div className="container">
        <div className="main-content">
          <h3 className="title">PARTS日本廠牌list</h3>
          <div className="product-list-table">
            <table className="table data-tables" cellSpacing={0} width="100%">
              <thead className="mobile-hide">
                <tr>
                  <th className="hd hd-number"><div className="text-center">ITEM</div></th>
                  <th className="hd hd-name-en"><div className="text-center">廠商名稱(英)</div></th>
                  <th className="hd hd-name-other"><div className="text-center">廠商名稱</div></th>
                  <th className="hd hd-product"><div className="text-center">販售過產品</div></th>
                  <th className="hd hd-download"><div className="text-center">檔案下載</div></th>
                </tr>
              </thead>
              <tbody>
                {brands.map((b) => (
                  <tr key={b.item}>
                    <td data-td="ITEM" className="bd"><div className="text-center">{b.item}</div></td>
                    <td data-td="廠商名稱(英)" className="bd"><div className="text-center">{b.name_en}</div></td>
                    <td data-td="廠商名稱(中/日)" className="bd"><div className="text-center">{b.name}</div></td>
                    <td data-td="販售過產品" className="bd"><div className="text-left">{b.products}</div></td>
                    <td data-td="檔案下載" className="bd">
                      <div className="text-center">
                        {b.file && (
                          <a href={b.file} className="download" target="_blank" rel="noreferrer">
                            <span className="glyphicon glyphicon-save-file" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
