// LOADWWEB
setTimeout(function() {
    $(".loadWeb").css("display","none");
},2000);
setTimeout(function() {
    $(".loadCart").css("display","none");
},800);

// SLIDESHOW
var s = 0, t = 0;
function changeImg(num) {
   s = s + num;
   if (s==5) s=1;
   else if (s<1) s=4;
   img = document.getElementById("slideId");
   img.src = `./Media/slide${s}.jpg`;
   t = 0;
}
var changeImgs = setInterval(function() {
    t++;
    if (t===5) changeImg(1);
},1000);

// CLOCK
let endDate = new Date("09/01/2023 00:00:00").getTime();
var check = setInterval(function() {
    let now = new Date().getTime();
    let distance = endDate - now;
    let day = Math.floor(distance / (1000*60*60*24));
    let hour = Math.floor((distance % (1000*60*60*24)) / (1000*60*60));
    let minute = Math.floor((distance % (1000*60*60)) / (1000*60));
    let second = Math.floor((distance % (1000*60)) / 1000);
    console.log(distance);
    document.getElementById("clock").innerText = `Remaining: ${day}d ${hour}h ${minute}m ${second}s `;
},1000);


$(document).ready(function() {
    cartUpdate();
    // RESPONSIVE
    var w = $(document).width();
    if (w <= 450) {
        $(".bar").on("click", function() {
            if($(this).hasClass("closed")) {
                $("nav .left").css("display","block");
                $(this).removeClass("closed");
                $(this).addClass("opened");
            }
            else {
                $("nav .left").css("display","none");
                $(this).removeClass("opened");
                $(this).addClass("closed");
            }
        });
        $(".sub").on("click",function() {
            if($(this).hasClass("closed")) {
                $(this).children().slideDown(300,'swing');
                $(this).removeClass("closed");
                $(this).addClass("opened");
            }
            else {
                $(this).find(".submenu").hide();
                $(this).removeClass("opened");
                $(this).addClass("closed");
            }
        });
    }

    // LOAD PRODUCTS
    fetch("./Data/Products.json").then(res => res.json()).then(data => {
        let h="";
        for (let c of data) {
            h += `<div><h2 class="fix default">${c.category}</h2><section class="items flex between box">`
            for (let product of c.products) {
                h += `<div class="item box"><div><img src="${product.i}" alt="Product"></div><h3 class="fix">${product.name}</h3><p class="fix">Tác giả: <authors>${product.author}</authors></p><p class="fix">Giá: <span>${product.price}</span></p></div>`;
            }
            h += `</section></div>`;
        }
        h += `<a class="fix more" href="index2.html">BẤM ĐỂ XEM THÊM SẢN PHẨM</a></p>`
        $("#mp").html(h);
    });
    fetch("./Data/AProducts.json").then(res => res.json()).then(data => {
        let h="";
        let i=0;
        for (let product of data) {
            h += `<div class="item box"><div><img src="${product.i}" alt="Product"></div><h3 class="fix">${product.name}</h3><p class="fix">Tác giả: <authors>${product.author}</authors></p><p class="fix">Giá: <span>${product.price}</span></p></div>`;
            i++;
            if(i==12) {$("#page1").html(h);h=""}
            if(i==24) {$("#page2").html(h);h=""}
            if(i==36) {$("#page3").html(h)}
        }
    });

    // PREVENT LINK
    $("a#none").on("click",function(event) {
        event.preventDefault();
    });

    // SUBMENU
    $(".sub").on("mouseenter",function() {
        $(this).children().slideDown(300,'swing');
    });
    $(".sub").on("mouseleave",function() {
        $(this).find(".submenu").hide();
    });

    // PRODUCTS PAGES
    $(".products > :not(#page1)").hide();
    $(".pages > a").on("click",function() {
        $(".pages > a").removeClass("active");
        $(this).addClass("active");
        let a = $(this).attr('href');
        $(".items").hide();
        $(".items").removeClass("ina");
        $("html").animate({scrollTop: 0},"slow");
        $(a).show();
        $(a).addClass("ina");
    });

    // INPUT FIND
    $(".find > i").on("click",function() {
        if($(this).hasClass("fa-magnifying-glass")) {
            $("#find").addClass("findin");
            $(".find").css('background-color','#d96c4e');
            $(this).removeClass("fa-magnifying-glass");
            $(this).addClass("fa-xmark");
        }
        else {
            $("#find").css("transition",".5s");
            $("#find").removeClass("findin");
            $(".find").css('background-color','transparent');
            $("#find").val("");
            $("div.inform").css('background-color','transparent');
            $("div.inform").html("");
            $(this).removeClass("fa-xmark");
            $(this).addClass("fa-magnifying-glass");
        }
    });
    
    // SEARCH
    $("#find").on("keyup",function(event) {
        let f = $(this).val().toLowerCase();
        let i = 0;
        let pros = document.querySelectorAll(".products .item");
        for(let p of pros) {
            let name = $(p).find("h3").text().toLowerCase();
            if(name.indexOf(f)>=0) {i++;}
        }
        $("div.inform").css('background-color','rgba(255, 255, 255, .7)');
        $("div.inform").html(`Có ${i} sản phẩm trùng khớp`);
        if(event.keyCode===13) {
            $(".items").hide();
            $(".pages").hide();
            if(i==0) $("#interact").append("Rất tiếc chúng tôi không thể tìm thấy sản phẩm bạn cần :(");
            for(let p of pros) {
                let q = $(p).clone();
                let name = $(q).find("h3").text().toLowerCase();
                if(name.indexOf(f)>=0) {
                    $("#interact").append(q);
                }
            }
            $("#interact").show();
            $("#find").on("input",function() {
                if($(this).val()==="") {
                    $("#interact").html("");
                    $(".items").hide();
                    $(".items").removeClass("ina");
                    $("html").animate({scrollTop: 0},"slow");
                    $("#page1").addClass("ina");
                    $("#page1").show();
                    $(".pages > a").removeClass("active");
                    $(".pages > a:first-child").addClass("active");
                    $(".pages").show();
                }
            })
        }
    });

    // FILTER
    $(".filter > a").on("click",function() {
        let fclass = $(this).attr('class');
        let pros = document.querySelectorAll(".products .item");
        let prosArr = Array.from(pros);
        prosArr.sort(function(a, b) {
            let price1 = parseFloat($(a).find("span").text().replace(/\./g, ""));
            let price2 = parseFloat($(b).find("span").text().replace(/\./g, ""));
            if  (fclass=="up") {
                return price1 - price2;
            }
            else {
                return price2 - price1;
            }
        });
        $(".products .items").html("");
        for(let i=0; i<prosArr.length;i++)
        {
            if (i < 12)
                $("#page1").append(prosArr[i]);
            else if (i >= 12 && i < 24) 
                $("#page2").append(prosArr[i]);
            else
                $("#page3").append(prosArr[i]);
        }
        $(".items").hide();
        $(".items").removeClass("ina");
        $("html").animate({scrollTop: 0},"slow");
        $("#page1").addClass("ina");
        $("#page1").show();
        $(".pages > a").removeClass("active");
        $(".pages > a:first-child").addClass("active");
    });
    
        
        const product = [
        {
            id: 1,
            i: "./Media/bs1.jpg",
            name: "Chuyện Hai Thành Phố",
            author:"Charles Dickens",
            rating:"5.0",
            price: "3.000.000",
            category: 'Best Sellers'
        },
        {
            id: 2,
            i: "./Media/bs2.jpg",
            name: "Chúa Tể Của Những Chiếc Nhẫn",
            author:"J.R.R. Tolkien",
            rating:"5.0",
            price: "1.700.000",
            category: 'Best Sellerss'
        },
        {
            id: 3,
            i: "./Media/bs3.jpg",
            name: "Hoàng Tử Bé",
            author:"Antoine de Saint-Exupéry",
            rating:"5.0",
            price: "1.800.000",
            category: 'Best Sellers'
        },
        {
            id: 4,
            i: "./Media/bs4.jpg",
            name: "Người Hobbit",
            author:"J.R.R. Tolkien",
            rating:"5.0",
            price: "5.500.000",
            category: 'Best Sellers'
        },
        {
            id: 5,
            i: "./Media/bs5.jpg",
            name: "Hồng Lâu Mộng",
            author:"Tào Tuyết Cần",
            rating:"5.0",
            price: "5.000.000",
            category: 'Best Sellers'
        },
        {
            id: 6,
            i: "./Media/hb1.jpg",
            name: "Cô Gái Có Hình Xăm Rồng",
            author:"Stieg Larsson",
            rating:"5.0",
            price: "5.500.000",
            category: 'Bí ẩn'
        },
        {
            id: 7,
            i: "./Media/hb2.jpg",
            name: "Và Rồi Chẳng Còn Ai",
            author:"Agatha Christie",
            rating:"5.0",
            price: "2.500.000",
            category: 'Bí ẩn'
        },
        {
            id: 8,
            i: "./Media/hb3.jpg",
            name: "Thiên Thần & Ác Quỷ",
            author:"Dan Brown",
            rating:"5.0",
            price: "900.000",
            category: 'Bí ẩn'
        },
        {
            id: 9,
            i: "./Media/hb4.jpg",
            name: "Rebecca",
            author:"Daphne du Maurier",
            rating:"5.0",
            price: "1.000.000",
            category: 'Bí ẩn'
        },
        {
            id: 10,
            i: "./Media/hb5.jpg",
            name: "Bố Già",
            author:"Mario Puzo",
            rating:"5.0",
            price: "800.000",
            category: 'Bí ẩn'
        },
        {
            id: 11,
            i: "./Media/hh1.jpg",
            name: "Trò Chơi Vương Quyền",
            author:"George R.R. Martin",
            rating:"5.0",
            price: "1.250.000",
            category: 'Giả tưởng và khoa học viễn tưởng'
        },
        {
            id: 12,
            i: "./Media/hh2.jpg",
            name: "Harry Potter Và Tên Tù Nhân Ngục Azkaban",
            author:"J.K. Rowling",
            rating:"5.0",
            price: "3.000.000",
            category: 'Giả tưởng và khoa học viễn tưởng'
        },
        {
            id: 13,
            i: "./Media/hh3.jpg",
            name: "Harry Potter Và Hòn Đá Phù Thủy",
            author:"J.K. Rowling",
            rating:"5.0",
            price: "1.500.000",
            category: 'Giả tưởng và khoa học viễn tưởng'
        },
        {
            id: 14,
            i: "./Media/hh4.jpg",
            name: "Harry Potter Và Bảo Bối Tử Thần",
            author:"J.K. Rowling",
            rating:"5.0",
            price: "5.000.000",
            category: 'Giả tưởng và khoa học viễn tưởng'
        },
        {
            id: 15,
            i: "./Media/hh5.jpg",
            name: "Harry Potter Và Chiếc Cốc Lửa",
            author:"J.K. Rowling",
            rating:"5.0",
            price: "2.000.000",
            category: 'Giả tưởng và khoa học viễn tưởng'
        },
        {
            id: 16,
            i: "./Media/hg1.jpg",
            name: "Giải Mã Mê Cung",
            author:"James Dashner",
            rating:"5.0",
            price: "5.000.000",
            category: 'Hành động'
        },
        {
            id: 17,
            i: "./Media/hg2.jpg",
            name: "Vị Thần Cuối Cùng",
            author:"Rick Riordan",
            rating:"5.0",
            price: "2.000.000",
            category: 'Hành động'
        },
        {
            id: 18,
            i: "./Media/hg3.jpg",
            name: "Dị Biệt",
            author:"Veronica Roth",
            rating:"5.0",
            price: "1.500.000",
            category: 'Hành động'
        },
        {
            id: 19,
            i: "./Media/hg4.jpg",
            name: "Bắt Lửa",
            author:"Suzanne Collins",
            rating:"5.0",
            price: "5.000.000",
            category: 'Hành động'
        },
        {
            id: 20,
            i: "./Media/hg5.jpg",
            name: "Đấu Trường Sinh Tử",
            author:"Suzanne Collins",
            rating:"5.0",
            price: "720.000",
            category: 'Hành động'
        },
        {
            id: 21,
            i: "./Media/hm1.jpg",
            name: "Trà Hoa Nữ",
            author:"Alexandre Dumas",
            rating:"5.0",
            price: "6.400.000",
            category: 'Tình cảm'
        },
        {
            id: 22,
            i: "./Media/hm2.jpg",
            name: "Rừng Na Uy",
            author:"Haruki Murakami",
            rating:"5.0",
            price: "2.700.000",
            category: 'Tình cảm'
        },
        {
            id: 23,
            i: "./Media/hm3.jpg",
            name: "Đàn Ông Sao Hỏa, Đàn Bà Sao Kim",
            author:"John Gray",
            rating:"5.0",
            price: "4.500.000",
            category: 'Tình cảm'
        },
        {
            id: 24,
            i: "./Media/hm4.jpg",
            name: "Cuốn Theo Chiều Gió",
            author:"Margaret Mitchell",
            rating:"5.0",
            price: "2.500.000",
            category: 'Tình cảm'
        },
        {
            id: 25,
            i: "./Media/hm5.jpg",
            name: "Cô gái năm ấy chúng ta cùng theo đuổi",
            author:"Cửu Bả Đao",
            rating:"5.0",
            price: "2.000.000",
            category: 'Tình cảm'
        },
        {
            id: 26,
            i: "./Media/cb1.jpg",
            name: "John Adams",
            author:"David McCullough",
            rating:"5.0",
            price: "3.200.000",
            category: 'Lịch sử'
        },
        {
            id: 27,
            i: "./Media/cb2.jpg",
            name: "Sự Trỗi Dậy Và Suy Tàn Của Đế Chế Thứ Ba – Lịch Sử Đức Quốc Xã",
            author:"William L. Shirer",
            rating:"5.0",
            price: "3.200.000",
            category: 'Lịch sử'
        },
        {
            id: 28,
            i: "./Media/cb3.jpg",
            name: "1776",
            author:"David McCullough",
            rating:"5.0",
            price: "3.200.000",
            category: 'Lịch sử'
        },
        {
            id: 29,
            i: "./Media/cb4.jpg",
            name: "Sapiens: Lược Sử Loài Người",
            author:"Yuval Noah Harari",
            rating:"5.0",
            price: "3.200.000",
            category: 'Lịch sử'
        },
        {
            id: 30,
            i: "./Media/cb5.jpg",
            name: "Lược Sử Thế Giới",
            author:"E.H. Gombrich",
            rating:"5.0",
            price: "3.200.000",
            category: 'Lịch sử'
        },
        ];
        console.table(
        product.filter(product => product.category.includes('Best Sellers')),
        product.filter(product => product.category.includes('Bí ẩn')),
        product.filter(product => product.category.includes('Giả tưởng và khoa học viễn tưởng')),
        product.filter(product => product.category.includes('Hành động')),
        product.filter(product => product.category.includes('Tình cảm')),
        product.filter(product => product.category.includes('Lịch sử'))
        );
       // QUANTITY
    $(document).on("input", "input[type=number]", function() {
        let minnum = $(this).attr("min");
        let maxnum = $(this).attr("max");
        let d = Number($(this).val());
        if (d < minnum) {
            $(this).val(minnum);
        } else if (d > maxnum) {
            $(this).val(maxnum);
        }
    });
    $(".quan > input[type=button]").on("click", function() {
        let maxnum = $(this).siblings("input[type=number]").attr("max");
        let minnum = $(this).siblings("input[type=number]").attr("min");
        let d = Number($(this).siblings("input[type=number]").val());
        if($(this).val() == "+")
            if(d < maxnum)
            d += 1; 
        if($(this).val() == "-")
            if(d > minnum)
            d -= 1;
        $(this).siblings("input[type=number]").attr('value',d).val(d).change();
    });

    // PRODUCT BOX
    $(document).on("click", ".item", function() {
        $("input[type=number]").attr('value',1).val(1);
        let i = $(this).find("img").attr('src');
        let h = $(this).find("h3").text();
        let p = $(this).find("span").text();
        let a = $(this).find("authors").text();
        let b = $(".pbox");
        if(p=="3.200.000")
           $(b).find("div.des").css("display","none");
        else $(b).find("div.des").css("display","block");
        $(b).find("img").attr('src',i);
        $(b).find("h3").html(h);
        $(b).find("a").html(a);
        $(b).find("p").html(p);
        $(b).show();
        $("i.fa-xmark").on("click",function() {
            $(".pbox").hide();
        });
        $('input[value="ADD"]').on("click",function() {
            let d = Number($("input[type=number]").val());
            let plane = $(".fa-paper-plane");
            $(plane).css({"right":"30%","top":"30%"});
            $("i.fa-cart-shopping").css("animation","none");
            $(plane).show(500,function() {
                $(".pbox").fadeOut(function() {
                    $(plane).animate({
                        top:"7%",
                        right:"3%",
                    },500,function() {
                        $(plane).fadeOut();
                        $("i.fa-cart-shopping").css("animation","carta 2s");
                    });
                });
            });

        // ADD ITEM TO CART
        let pro = { source: i, name: h,author:a ,price: p, quan: d };
        let proJSON = JSON.stringify(pro);
        let key = `product${new Date().getTime()}`;
        localStorage.setItem(key, proJSON);
        cartUpdate();
        });
    });

    // DELETE ITEM IN CART
    $(document).on("click",".fa-square-minus",function() {
        if(confirm("Bạn có chắc chắn xóa sản phẩm ra khỏi giỏ hàng không?")===true) {
            this.parentNode.remove();
            let key = $(this).parent().attr('id');
            localStorage.removeItem(key);
            cartUpdate();
        }
    })

    // CHANGE ITEM IN CART
    $(document).on("change input", ".citem input[type=number]", function() {
        let key = $(this).closest('.citem').attr('id');
        proJSON = localStorage.getItem(key);
        pro = JSON.parse(proJSON);
        pro.quan = $(this).val();
        let newPro = JSON.stringify(pro);
        localStorage.setItem(key,newPro);
        cartUpdate();
        location.reload();
    });

    // DAT HANG
    $("button").on("click", function() {
        let Uname = $("div.right li:first-child input").val();
        let mail = $("input[type=email]").val();
        let sdt = $("div.right li:nth-child(3) input").val();
        let address = $("div.right li:nth-child(4) input").val();
        let bank = $("div.bank > input").is(":checked");
        let cod = $("div.cod > input").is(":checked");
        let checkb = $("input[type=checkbox]").is(":checked");
        if ($(".sum").html() == "")
            alert("Giỏ hàng của bạn đang trống");
        else if(Uname === "" || mail === "" || sdt === "" || address === "")
            alert("Nhập thiếu thông tin");
        else if(bank == false && cod == false)
            alert("Chưa chọn hình thức thanh toán");
        else if(checkb == false)
            alert("Chưa đồng ý điều khoản");
        else {
            alert("Đặt hàng thành công!!! Cảm ơn bạn đã tin tưởng FLOWOVER");
            window.location.href = 'index.html'
            localStorage.clear();
        }
    })
});

function cartUpdate() {
    $("#cart").empty();
    if (localStorage.length == 0) {
        $("#cart").html(`Giỏ hàng của bạn đang trống!!! Hãy bấm nút tải lại hoặc tham khảo các sản phẩm rồi quay lại nhé!!!`);
        $(".sum").html("");
    }
    else {
        let totalPrice = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith("product")) {
                const proJSON = localStorage.getItem(key);
                const pro = JSON.parse(proJSON);
                let priceNum = pro.price.replace(/\./g, "");
                let total = parseFloat(pro.quan) * parseFloat(priceNum);
                totalPrice+=total;
                let priceFormat = total.toLocaleString();
                let h = `<div class="row flex between citem" id="${key}">
                    <p>Sản phẩm ${i + 1}</p>
                    <div>
                        <img src="${pro.source}" alt="Product">
                    </div>
                    <div>
                        <p>${pro.name}</p>
                        <p>${pro.price}</p>
                        <div class="box quan">
                            <input type="button" value="-">
                            <input type="number" min="1" max="20" value="${pro.quan}">
                            <input type="button" value="+">
                        </div>
                    </div>
                    <p>${priceFormat}</p>
                    <i class="fa-regular fa-square-minus"></i>
                </div>`;
                $("#cart").append(h);
            }
        }
        $(".sum").html(`<div>Tổng</div><div>${totalPrice.toLocaleString()}</div>`);
    }
}