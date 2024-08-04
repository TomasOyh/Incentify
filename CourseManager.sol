// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Definición de la interfaz de AggregatorV3Interface
interface AggregatorV3Interface {
    function decimals() external view returns (uint8);
    function description() external view returns (string memory);
    function version() external view returns (uint256);

    function getRoundData(uint80 _roundId)
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );

    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );
}

contract CourseManager {
    address public owner;
    AggregatorV3Interface internal priceFeed;

    struct Course {
        uint256 costUSD; // Precio en dólares
        address creator;
        bool exists;
        uint256 durationInDays;
    }
    struct Purchase {
        uint256 amountPaid;
        uint256 amountRefunded;
        uint256 purchaseTime;
        uint256 deadline;
    }

    mapping(uint256 => Course) public courses;
    mapping(uint256 => address[]) public coursePurchases; // Registro de compras por curso
    mapping(address => mapping(uint256 => Purchase)) public purchases;
    uint256 public courseCount;

    event CourseCreated(uint256 indexed courseId, address indexed creator, uint256 cost, uint256 durationInDays);
    event CoursePurchased(uint256 indexed courseId, address indexed buyer, uint256 amountPaid);
    event CourseGifted(uint256 indexed courseId, address indexed buyer, address indexed gifted, uint256 amountPaid);
    event CoursePartiallyRefunded(uint256 indexed courseId, address indexed buyer, uint256 refundAmount);
    event CourseRefunded(uint256 indexed courseId, address indexed buyer, uint256 totalRefundAmount);
    event FundsClaimed(uint256 indexed courseId, address indexed creator, uint256 amount);

    constructor(address _priceFeed) {
        owner = msg.sender;
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    function getLatestPrice() public view returns (int) {
        (
            /* uint80 roundID */,
            int price,
            /* uint startedAt */,
            /* uint timeStamp */,
            /* uint80 answeredInRound */
        ) = priceFeed.latestRoundData();
        return price;
    }

    function createCourse(uint256 costUSD, uint256 durationInDays) external {
        require(costUSD > 0, "El costo debe ser mayor a 0");
        require(durationInDays > 0, "La duracion debe ser mayor a 0");

        courseCount++;
        courses[courseCount] = Course({
            costUSD: costUSD,
            creator: msg.sender,
            exists: true,
            durationInDays: durationInDays
        });

        emit CourseCreated(courseCount, msg.sender, costUSD, durationInDays);
    }

    function buyCourse(uint256 courseId) external payable {
        Course storage course = courses[courseId];
        require(course.exists, "Course does not exist");

        uint256 ethPriceInUSD = uint(getLatestPrice()) / 1e8;
        require(ethPriceInUSD > 0, "Invalid ETH price");
        // Calculate the cost in ETH
        uint256 courseCostInETH = (course.costUSD) * 1e18 / ethPriceInUSD;
        uint256 requiredAmount = courseCostInETH * 3; // User pays triple the course cost

        require(msg.value >= requiredAmount, "Insufficient payment");

        // Record the purchase
        purchases[msg.sender][courseId] = Purchase({
            amountPaid: requiredAmount,
            amountRefunded: 0,
            purchaseTime: block.timestamp,
            deadline: block.timestamp + (course.durationInDays * 1 days)
        });

        coursePurchases[courseId].push(msg.sender);

        // Transfer the course cost to the creator
        payable(course.creator).transfer(courseCostInETH);

        // Calculate and return excess payment
        uint256 excessPayment = msg.value - requiredAmount;
        if (excessPayment > 0) {
            payable(msg.sender).transfer(excessPayment);
        }
        emit CoursePurchased(courseId, msg.sender, msg.value);
    }

    function giftCourse(uint256 courseId, address gifted) external payable {
        Course storage course = courses[courseId];
        require(course.exists, "Course does not exist");

        uint256 ethPriceInUSD = uint(getLatestPrice()) / 1e8;
        require(ethPriceInUSD > 0, "Invalid ETH price");
        // Calculate the cost in ETH
        uint256 courseCostInETH = (course.costUSD) * 1e18 / ethPriceInUSD;
        uint256 requiredAmount = courseCostInETH * 3; // User pays triple the course cost

        require(msg.value >= requiredAmount, "Insufficient payment");

        // Record the purchase
        purchases[gifted][courseId] = Purchase({
            amountPaid: requiredAmount,
            amountRefunded: 0,
            purchaseTime: block.timestamp,
            deadline: block.timestamp + (course.durationInDays * 1 days)
        });

        coursePurchases[courseId].push(gifted);

        // Transfer the course cost to the creator
        payable(course.creator).transfer(courseCostInETH);

        // Calculate and return excess payment
        uint256 excessPayment = msg.value - requiredAmount;
        if (excessPayment > 0) {
            payable(msg.sender).transfer(excessPayment);
        }
        emit CourseGifted(courseId, msg.sender, gifted, msg.value);
    }

    // Función para marcar un curso como completado y devolver un porcentaje del pago a una dirección específica
    function completeCourse(uint256 courseId, address buyer, uint256 percentage) external {
        Course storage course = courses[courseId];
        require(course.exists, "El curso no existe");
        require(percentage > 0 && percentage <= 100, "El porcentaje debe estar entre 1 y 100");

        Purchase storage purchase = purchases[buyer][courseId];
        require(purchase.amountPaid > 0, "El curso no ha sido comprado");

        uint256 totalRefundable = purchase.amountPaid - purchase.amountPaid / 3; // Monto total reembolsable
        uint256 amountToRefund = (totalRefundable * percentage) / 100;
        uint256 remainingRefundable = totalRefundable - purchase.amountRefunded;
        require(amountToRefund <= remainingRefundable, "El monto a reembolsar excede el saldo pendiente");

        // Verifica si el curso se completa dentro del tiempo permitido
        require(block.timestamp <= purchase.deadline, "El tiempo para completar el curso ha expirado");

        purchase.amountRefunded += amountToRefund;
        payable(buyer).transfer(amountToRefund);

        if (purchase.amountRefunded == totalRefundable) {
            _removePurchase(courseId, buyer); // Elimina la compra después de completar el curso
            emit CourseRefunded(courseId, buyer, purchase.amountRefunded);
        } else {
            emit CoursePartiallyRefunded(courseId, buyer, amountToRefund);
        }
    }

    // Función para que el creador reclame los fondos bloqueados si el tiempo límite ha pasado
    function claimFunds(uint256 courseId) external {
        Course storage course = courses[courseId];
        require(course.exists, "El curso no existe");
        require(msg.sender == course.creator, "No podes reclamar dinero de un curso que no es tuyo");
        uint256 totalLockedAmount = 0;

        // Itera sobre todas las compras para el curso
        address[] storage buyers = coursePurchases[courseId];
        for (uint256 i = 0; i < buyers.length; i++) {
            address buyer = buyers[i];
            Purchase storage purchase = purchases[buyer][courseId];
            if (purchase.amountPaid > 0 && block.timestamp > purchase.deadline && purchase.amountRefunded < (purchase.amountPaid - purchase.amountPaid / 3)) {
                uint256 lockedAmount = (purchase.amountPaid - purchase.amountPaid / 3) - purchase.amountRefunded;
                totalLockedAmount += lockedAmount;
                purchase.amountRefunded = purchase.amountPaid - purchase.amountPaid / 3; // Marca como totalmente reembolsado
                _removePurchase(courseId, buyer); // Elimina la compra después de reclamar
            }
        }

        require(totalLockedAmount > 0, "No hay fondos bloqueados disponibles para reclamar");

        payable(msg.sender).transfer(totalLockedAmount);
        emit FundsClaimed(courseId, owner, totalLockedAmount);
    }

    // Función auxiliar para eliminar una compra de la lista de compras de un curso
    function _removePurchase(uint256 courseId, address buyer) internal {
        address[] storage buyers = coursePurchases[courseId];
        for (uint256 i = 0; i < buyers.length; i++) {
            if (buyers[i] == buyer) {
                buyers[i] = buyers[buyers.length - 1];
                buyers.pop();
                break;
            }
        }
    }
}