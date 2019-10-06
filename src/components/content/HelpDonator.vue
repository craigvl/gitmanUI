<template lang="html">
    <div class="slider-container">
        <div class="slider-row-heading">Steps to add a bounty to an issue</div>
        <div class="slider-row">
            <div class="slider-row-icon"><i class="el-icon-arrow-right"></i></div>
            <div class="slider-row-text">First you will need to enable a repository, click enable repository</div>
        </div>
        <div class="slider-row">
            <div class="slider-row-icon"><i class="el-icon-arrow-right"></i></div>
            <div class="slider-row-text">You will need to have metamask installed, if you dont here is a <a target="_blank" class="el-dropdown-link" href="https://blog.pryze.com/how-to-create-a-private-wallet-with-metamask-1386255f2bf8">link</a>that shows you how to install metamask  </div>
        </div>
        <div class="slider-row">
            <div class="slider-row-icon"><i class="el-icon-arrow-right"></i></div>
            <div class="slider-row-text">Click create issue or select bounty issue from the drop down to bounty an existing issue</div>
        </div>
        <div class="slider-row">
            <div class="slider-row-icon"><i class="el-icon-arrow-right"></i></div>
            <div class="slider-row-text">Fill in the details, select the amount of Ethereum that will be the reward and click bounty issue</div>
        </div>
        <div class="slider-row">
            <div class="slider-row-icon"><i class="el-icon-arrow-right"></i></div>
            <div class="slider-row-text">Metamask will ask you to confirm the transaction, confirm and then the funding process will begin</div>
        </div>
    </div>
</template>

<style>

    .slider-container {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        padding: 20px;
    }

    .slider-row {
        display: flex;
        flex-direction: row-reverse;
        padding-top: 20px;
    }

    .slider-row-icon {
    }

    .slider-row-text {
        text-align: left;
    }

    .slider-row-heading {
        display: flex;
        flex-direction: row-reverse;
        font-weight: bold;
    }

    p {
        font-size: 0.8rem;
    }

    h1 {
        font-size: 1.2rem;
        font-weight: bold;
        margin-bottom: 0.1rem;
    }

</style>
