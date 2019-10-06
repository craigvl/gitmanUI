<template lang="html">
    <div class="slider-container">
        <div class="slider-row-heading">Steps to earn your reward</div>
        <div class="slider-row">
            <div class="slider-row-icon"><i class="el-icon-arrow-right"></i></div>
            <div class="slider-row-text">Click Start Work</div>
        </div>
        <div class="slider-row">
            <div class="slider-row-icon"><i class="el-icon-arrow-right"></i></div>
            <div class="slider-row-text">Provide an Ethereum wallet address</div>
        </div>
        <div class="slider-row">
            <div class="slider-row-icon"><i class="el-icon-arrow-right"></i></div>
            <div class="slider-row-text">If you don't have a wallet this <a target="_blank" class="el-dropdown-link" href="https://blog.pryze.com/how-to-create-a-private-wallet-with-metamask-1386255f2bf8">link</a>shows you how to create one</div>
        </div>
        <div class="slider-row">
            <div class="slider-row-icon"><i class="el-icon-arrow-right"></i></div>
            <div class="slider-row-text">Click create branch</div>
        </div>
        <div class="slider-row">
            <div class="slider-row-icon"><i class="el-icon-arrow-right"></i></div>
            <div class="slider-row-text">Fix the issue on the branch that was created</div>
        </div>
        <div class="slider-row">
            <div class="slider-row-icon"><i class="el-icon-arrow-right"></i></div>
            <div class="slider-row-text">When fixed push changes to Github and then click submit as pull request</div>
        </div>
        <div class="slider-row">
            <div class="slider-row-icon"><i class="el-icon-arrow-right"></i></div>
            <div class="slider-row-text">Once the pull request is merged the reward will be sent to your wallet</div>
        </div>
        <div class="slider-row">
            <div class="slider-row-icon"><i class="el-icon-arrow-right"></i></div>
            <div class="slider-row-text">Here is a <a target="_blank" class="el-dropdown-link" href="https://youtu.be/pw3AFkWl2qc">video</a>that shows the above steps</div>
        </div>
        <div class="slider-row">
            <div class="slider-row-icon"><i class="el-icon-arrow-right"></i></div>
            <div class="slider-row-text">If you have any questions or feedback you can chat to us <a target="_blank" class="el-dropdown-link" href="https://t.me/joinchat/Gr-5fxF7FTHdNfzKQKJGgQ">here</a></div>
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
