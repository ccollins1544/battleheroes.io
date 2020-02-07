import React from 'react';

const BattleCard = () => {
    return (
        <div className="card" style="width: 18rem;">

        <img src="../images/green-ranger.png" className="card-img-top" alt="green ranger">
        <div className="card-body">
            <div className="progress">
                <div className="progress-bar bg-success" role="progressbar" style="width: 40%" aria-valuenow="15"
                    aria-valuemin="0" aria-valuemax="100">40%</div>
                <div className="progress-bar bg-warning" role="progressbar" style="width: 40%" aria-valuenow="30"
                    aria-valuemin="0" aria-valuemax="100">40%</div>
                <div className="progress-bar bg-danger" role="progressbar" style="width: 20%" aria-valuenow="30"
                    aria-valuemin="0" aria-valuemax="100">20%</div>
            </div>
            <p className="card-text">
                <li className="list-group-item"> <b>Green Ranger</b> </li>
                <li className="list-group-item"> <b>MAX HP: 100</b> </li>
                <li className="list-group-item"> <b>ATK 1:</b> <i>Iron Tail</i> </li>
                <li className="list-group-item"> <b>ATK 2:</b> <i>Thunderbolt</i> </li>
            </p>
            <button type="button" className="btn btn-danger btn-lg btn-block">ATTACK</button>
        </div>
    </div> 
    ) 
}

export default BattleCard;