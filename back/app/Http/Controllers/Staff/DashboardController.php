<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;

class DashboardController extends Controller
{
    protected $orderController;
    protected $productController;
    protected $dispatchController;
    protected $clientController;

    public function __construct(
        OrderController $orderController,
        ProductController $productController,
        DispatchController $dispatchController,
        ClientController $clientController
    ) {
        $this->orderController = $orderController;
        $this->productController = $productController;
        $this->dispatchController = $dispatchController;
        $this->clientController = $clientController;
    }

    public function index()
    {
        return response()->json([
            'kpis' => [
                $this->orderController->getMonthlyRevenueData(),
                $this->productController->getProductsSoldData(),
                $this->productController->getStockValueData(),
                $this->dispatchController->getActiveDispatchesData(),
            ],
            'charts' => [
                'weekly_sales' => $this->orderController->getWeeklySalesData(),
                'dispatch_status' => $this->dispatchController->getDispatchStatusData(),
            ],
            'tables' => [
                'top_products' => $this->productController->getTopSellingProductsData(),
                'low_stock' => $this->productController->getLowStockProductsData(),
                'top_clients' => $this->clientController->getTopClientsData(),
            ],
        ], 200);
    }
}
