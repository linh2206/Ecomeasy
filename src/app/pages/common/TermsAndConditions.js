import React from 'react';
import PropTypes from 'prop-types';
import { Container } from '@material-ui/core';
import { toAbsoluteUrl } from "../../../_metronic/utils/utils"
import { Link } from "react-router-dom";

TermsAndConditions.propTypes = {

};

function TermsAndConditions(props) {
    return (
        <div>
            <div className="sticky-header">
                <Container maxWidth="lg">
                    <Link to="/"><img src={toAbsoluteUrl('/media/logos/ece-logo.svg')} /></Link>
                </Container>
            </div>
            <Container maxWidth="lg">
                <div className="information">
                    <p className="information__legend">Terms and conditions</p>
                    <p className="information__title">QUY TRÌNH GIẢI QUYẾT TRANH CHẤP, KHIẾU NẠI</p>
                    <ul className="information__level1">
                        <li><span>Đối tác và ECOMEASY có trách nhiệm tiếp nhận khiếu nại và hỗ trợ
Khách hàng liên quan đến giao dịch tại ECOMEASY.</span></li>
                        <li><span>Khi phát sinh tranh chấp, ECOMEASY đề cao giải pháp thương
                        lượng, hòa giải giữa các bên nhằm duy trì sự tin cậy của Thành viên
                        vào chất lượng dịch vụ của ECOMEASY và thực hiện theo các bước
sau:</span>
                            <ul className="information__level3">
                                <li><span>Bước 1: Khách hàng khiếu nại về hàng hóa của Đối tác qua
                                email: loi@ecomeasy.asia hoặc gọi đến số điện thoại 0928625037 hoặc
                                gửi đến địa chỉ Công ty TNHH ECOMEASY E-COMMERCE, địa chỉ:
Tầng 3, 208-210 Khánh Hội, Phường 6, Quận 4, Tp HCM</span></li>
                                <li><span>Bước 2: Bộ phận chăm sóc Thành viên của ECOMEASY sẽ tiếp nhận
                                các khiếu nại của Khách hàng, tùy theo tính chất và mức độ của khiếu
                                nại thì ECOMEASY sẽ có những biện pháp cụ thể hỗ trợ Khách hàng để
giải quyết tranh chấp đó;</span></li>
                                <li><span>Bước 3: ECOMEASY yêu cầu Khách hàng và Đối tác phải cung cấp đủ
thông tin liên quan đến giao dịch, hàng hóa.</span></li>
                                <li><span>Bước 4: ECOMEASY đứng ra làm bên thứ 3 hòa giải cho Khách hàng
                                và Đối tác hoặc tiến hành thương lượng với Khách hàng/ Đối tác nếu
                                tranh chấp với ECOMEASY. Trong trường hợp tranh chấp, khiếu nại
                                nằm ngoài khả năng và thẩm quyền của ECOMEASY thì ban quản trị sẽ
                                yêu cầu Khách hàng đưa vụ việc này ra cơ quan nhà nước có thẩm
quyền giải quyết theo pháp luật.</span>
                                    <ul>
                                        <li><span>Thời gian tiếp nhận và xử lý phản ánh là 03 (ba) ngày làm việc kể từ
thời điểm công ty nhận được phản ánh từ Khách hàng.</span></li>
                                        <li><span>ECOMEASY tôn trọng và nghiêm túc thực hiện các quy định pháp
                                        luật về bảo vệ quyền lợi người tiêu dùng. ECOMEASY sẽ cung cấp
                                        những thông tin lên quan đến Khách hàng và Đối tác nếu được
Khách hàng hoặc Đối tác (liên quan đến tranh chấp) yêu cầu.</span></li>
                                        <li><span>Khách hàng và Đối tác có trách nhiệm trong việc tích cực giải quyết
                                        vấn đề. Đối tác hàng có trách nhiệm cung cấp văn bản liên quan đến
sự việc khiến Thành viên khiếu nại.</span></li>
                                        <li><span>Khách hàng và Đối tác sau khi giải quyết xong tranh chấp phải báo
                                        lại cho ban quản trị ECOMEASY. Trong trường hợp lỗi thuộc về Đối
                                        tác, ECOMEASY sẽ có biện pháp cảnh cáo, khóa tài khoản hoặc
                                        chuyển cho cơ quan pháp luật có thẩm quyền tùy theo mức độ sai
                                        phạm. ECOMEASY sẽ chấm dứt và gỡ bỏ toàn bộ bài viết, bài live-
                                        stream về sản phẩm của Đối tác đó trên ECOMEASY đồng thời yêu
cầu Đối tác đó bồi thường trên cơ sở thỏa thuận với Khách hàng.</span></li>
                                        <li><span>Nếu thương lượng hòa giải không thành thì Đối tác hoặc Khách
                                        hàng đều có quyền nhờ đến cơ quan pháp luật có thẩm quyền can
                                        thiệp nhằm bảo đảm lợi ích hợp pháp của các bên nhất là cho Thành
viên.</span></li>
                                    </ul></li>
                            </ul></li>
                    </ul>
                </div>
            </Container>
        </div>
    );
}

export default TermsAndConditions;