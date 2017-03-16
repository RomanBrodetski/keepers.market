pragma solidity ^0.4.8;
import './token/ERC20.sol';

contract EventfulMarket {
    event ItemUpdate( uint id );
    event Trade( uint sell_how_much, address indexed sell_which_token,
                 uint buy_how_much, address indexed buy_which_token );

    event LogMake(
        bytes32  indexed  id,
        bytes32  indexed  pair,
        address  indexed  maker,
        ERC20             haveToken,
        ERC20             wantToken,
        uint128           haveAmount,
        uint128           wantAmount,
        uint64            timestamp
    );

    event LogTake(
        bytes32           id,
        bytes32  indexed  pair,
        address  indexed  maker,
        ERC20             haveToken,
        ERC20             wantToken,
        address  indexed  taker,
        uint128           takeAmount,
        uint128           giveAmount,
        uint64            timestamp
    );

    event LogKill(
        bytes32  indexed  id,
        bytes32  indexed  pair,
        address  indexed  maker,
        ERC20             haveToken,
        ERC20             wantToken,
        uint128           haveAmount,
        uint128           wantAmount,
        uint64            timestamp
    );
}
