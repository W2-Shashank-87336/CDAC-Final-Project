import React from 'react'

 const DashboardContent = () => {
  
    return (
      <>
      {/* Stats Cards */}
      <div className="container-fluid p-4">
        <div className="row">
          <div className="col-md-4">
            <div className="card text-white bg-primary mb-3">
              <div className="card-body">
                <h5 className="card-title">Total Orders</h5>
                <p className="card-text">150</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-white bg-success mb-3">
              <div className="card-body">
                <h5 className="card-title">Revenue</h5>
                <p className="card-text">$12,500</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-white bg-warning mb-3">
              <div className="card-body">
                <h5 className="card-title">Pending Orders</h5>
                <p className="card-text">5</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="card">
          <div className="card-header">Recent Orders</div>
          <div className="card-body">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer</th>
                  <th>Item</th>
                  <th>Status</th>
                </tr>        
            {/* <Route path='/order' element={< */}

              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>John Doe</td>
                  <td>Pizza</td>
                  <td>Delivered</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Jane Smith</td>
                  <td>Burger</td>
                  <td>Pending</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>  
    </>
    ) 
  
}

export default DashboardContent;